package models

import "gorm.io/gorm"

type Inventory struct {
	gorm.Model
	ToyID uint `gorm:"unique"`
	Stock int
}
