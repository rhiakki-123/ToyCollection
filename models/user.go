package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID       int    `gorm:"primaryKey;column:id" json:"userId"`
	Username string `gorm:"column:username" json:"username"`
	Password string `gorm:"column:password" json:"-"`
	Role     string
}
