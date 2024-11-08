package main

import (
	"log"
	"net/http"
	"time"
	"toy-api/middleware"
	"toy-api/models"
	"toy-api/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {

	r := gin.Default()

	// Set trusted proxies to make sure the client IP is the real client IP in case you are behind a reverse proxy
	if err := r.SetTrustedProxies([]string{"127.0.0.1"}); err != nil {
		log.Fatal("Failed to set trusted proxies: ", err)
	}

	// Middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Initialize the database
	initDatabase()

	// Routes
	r.POST("/signup", signup)
	r.POST("/login", login)
	r.GET("/profile", middleware.AuthMiddleware(), profile)
	r.POST("/logout", middleware.AuthMiddleware(), logout)

	authorized := r.Group("/")
	authorized.Use(middleware.AuthMiddleware())
	{
		authorized.GET("/toys", getToys)
		authorized.POST("/toys", middleware.RoleMiddleware("admin", "seller"), createToy)
		authorized.GET("/toys/:id", getToyById)
		authorized.PUT("/toys/:id", middleware.RoleMiddleware("admin", "seller"), updateToy)
		authorized.DELETE("/toys/:id", middleware.RoleMiddleware("admin"), deleteToy)

		// Inventory management endpoints
		authorized.POST("/inventory/add", middleware.RoleMiddleware("admin", "seller"), addStock)
		authorized.POST("/inventory/remove", middleware.RoleMiddleware("admin", "seller"), removeStock)
		authorized.GET("/inventory/stock/:toy_id", getStock)

		// Order management endpoints
		authorized.POST("/orders", createOrder)
		authorized.GET("/orders/:order_id", getOrder)
		authorized.GET("/users/:user_id/orders", getUserOrders)
		authorized.PUT("/orders/:order_id/status", updateOrderStatus)
		authorized.DELETE("/orders/:order_id", middleware.RoleMiddleware("admin"), deleteOrder)
	}

	r.Run(":8080")
}

func initDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("toys.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// AutoMigrate should create the table if it doesn’t exist
	if err := DB.AutoMigrate(&models.Toy{}, &models.User{}, &models.Inventory{}, &models.Order{}, &models.OrderItem{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
}

// Handler functions

// User registration
func signup(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	if err := DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

// User login
func login(c *gin.Context) {

	// Bind the input data to the LoginInput struct
	var userInput models.User
	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dbUser models.User
	//Retireve the user from the database using the username
	if err := DB.Where("username = ?", userInput.Username).First(&dbUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Compare the stored hashed password, with the password supplied by the user
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(userInput.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// User authenticated successfully
	log.Printf("User found: ID=%d, Username=%s, Role=%s\n", dbUser.ID, dbUser.Username, dbUser.Role)

	token, err := utils.GenerateJWT(dbUser.Username, dbUser.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userId": dbUser.ID,
		"token":  token,
	})
}

// Fetch user profile
func profile(c *gin.Context) {
	username, _ := c.Get("username")
	var user models.User
	if err := DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

// User logout
func logout(c *gin.Context) {
	// Invalidate the token (implementation depends on your token management strategy)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Get all toys
func getToys(c *gin.Context) {
	var toys []models.Toy //
	if err := DB.Find(&toys).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, toys)
}

// Create a new toy
func createToy(c *gin.Context) {
	var newToy models.Toy
	if err := c.ShouldBindJSON(&newToy); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := DB.Create(&newToy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newToy)
}

// Get toy by ID
func getToyById(c *gin.Context) {
	id := c.Param("id")
	var toy models.Toy
	if err := DB.First(&toy, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Toy not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, toy)
}

// Update a toy by ID
func updateToy(c *gin.Context) {
	id := c.Param("id")
	var toy models.Toy
	if err := DB.Where("id = ?", id).First(&toy).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Toy not found"})
		return
	}

	if err := c.ShouldBindJSON(&toy); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := DB.Save(&toy).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Toy updated successfully"})
}

// Delete a toy by ID
func deleteToy(c *gin.Context) {
	id := c.Param("id")
	if err := DB.Delete(&models.Toy{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Toy not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Toy deleted"})
}

// Inventory management functions

// Add stock to a toy
func addStock(c *gin.Context) {
	var request struct {
		ToyID  uint `json:"toy_id"`
		Amount int  `json:"amount"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var inventory models.Inventory
	if err := DB.Where("toy_id = ?", request.ToyID).First(&inventory).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			inventory = models.Inventory{ToyID: request.ToyID, Stock: request.Amount}
			if err := DB.Create(&inventory).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		inventory.Stock += request.Amount
		if err := DB.Save(&inventory).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Stock added successfully"})
}

// Remove stock from a toy
func removeStock(c *gin.Context) {
	var request struct {
		ToyID  uint `json:"toy_id"`
		Amount int  `json:"amount"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var inventory models.Inventory
	if err := DB.Where("toy_id = ?", request.ToyID).First(&inventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if inventory.Stock < request.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	inventory.Stock -= request.Amount
	if err := DB.Save(&inventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Stock removed successfully"})
}

// Check stock levels for a specific toy
func getStock(c *gin.Context) {
	toyID := c.Param("toy_id")
	var inventory models.Inventory
	if err := DB.Where("toy_id = ?", toyID).First(&inventory).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Toy not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"stock": inventory.Stock})
}

// Order management functions

// Create a new order
func createOrder(c *gin.Context) {
	var request struct {
		UserID uint `json:"user_id"`
		Items  []struct {
			ToyID    uint `json:"toy_id"`
			Quantity int  `json:"quantity"`
		} `json:"items"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var totalCost float64
	var orderItems []models.OrderItem

	for _, item := range request.Items {
		var toy models.Toy
		if err := DB.First(&toy, item.ToyID).Error; err != nil {
			log.Printf("Toy not found: %d", item.ToyID) // Debugging line
			c.JSON(http.StatusBadRequest, gin.H{"error": "Toy not found"})
			return
		}

		orderItem := models.OrderItem{
			ToyID:    item.ToyID,
			Quantity: item.Quantity,
			Price:    toy.Price,
		}
		totalCost += toy.Price * float64(item.Quantity)
		orderItems = append(orderItems, orderItem)

		// Reduce stock in inventory
		var inventory models.Inventory
		if err := DB.Where("toy_id = ?", item.ToyID).First(&inventory).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Inventory not found"})
			return
		}
		if inventory.Stock < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
			return
		}
		inventory.Stock -= item.Quantity
		if err := DB.Save(&inventory).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	order := models.Order{
		UserID:     request.UserID,
		Status:     "pending",
		TotalCost:  totalCost,
		OrderItems: orderItems,
	}

	if err := DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Printf("Order created with ID: %d", order.ID) // Debugging line
	c.JSON(http.StatusCreated, order)
}

// Retrieve details of a specific order
func getOrder(c *gin.Context) {
	orderID := c.Param("order_id")
	var order models.Order
	if err := DB.Preload("OrderItems").First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, order)
}

// Retrieve order history for a user
func getUserOrders(c *gin.Context) {
	userID := c.Param("user_id")
	var orders []models.Order
	if err := DB.Preload("OrderItems").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// delete order
func deleteOrder(c *gin.Context) {
	orderID := c.Param("order_id")
	var order models.Order
	if err := DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	if err := DB.Delete(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
}

// Update the status of an order
func updateOrderStatus(c *gin.Context) {
	orderID := c.Param("order_id")

	var request struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status
	validStatuses := map[string]bool{
		"pending":   true,
		"shipped":   true,
		"delivered": true,
		"cancelled": true,
	}

	if !validStatuses[request.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	var order models.Order
	if err := DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	order.Status = request.Status
	if err := DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated successfully", "order": order})
}
