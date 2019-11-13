package main

import(
	"fmt"

	"github.com/go-bongo/bongo"
)

type WindSchema struct {
	bongo.DocumentBase `bson:",inline"`
	Wind int
}

func main()  {
	fmt.Printf("Hello, world!")
}