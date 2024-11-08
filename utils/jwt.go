package utils

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Secret key used to sign tokens. Replace with your actual secret.
var jwtSecret = []byte(os.Getenv("your_secret_key"))

// Claims struct that will be encoded to a JWT.
type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

// GenerateJWT generates a new JWT token.
func GenerateJWT(username, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // 1 day expiration time for tokens
	claims := &Claims{                               // Create a new Claims struct with the username, role, and expiration time.
		Username: username,
		Role:     role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
			Issuer:    "Toy-Collection-App",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// func ValidateJWT(tokenString string) (*jwt.Token, error) {
// 	return jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
// 		}
// 		return jwtSecret, nil
// 	})
// }

func ValidateJWT(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, err
	}
	return claims, nil
}
