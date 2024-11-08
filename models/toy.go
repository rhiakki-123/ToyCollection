package models

type Toy struct {
	ID    uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Name  string  `json:"name"`
	Type  string  `json:"type"`
	Price float64 `json:"price"`
}
