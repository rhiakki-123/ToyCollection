package models

import "gorm.io/gorm"

// Order represents a customer order
type Order struct {
	gorm.Model
	UserID     uint        `json:"user_id"`
	Status     string      `json:"status"`
	TotalCost  float64     `json:"total_cost"`
	OrderItems []OrderItem `json:"order_items" gorm:"foreignKey:OrderID"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	gorm.Model
	OrderID  uint    `json:"order_id"`
	ToyID    uint    `json:"toy_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}
