package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Response struct {
	Message string      `json:"message"`
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
}

func responseSuccess(c echo.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{Code: http.StatusOK, Data: data})
}

func responseFailureWithMessage(c echo.Context, message string) {
	c.JSON(http.StatusOK, Response{Code: http.StatusBadRequest, Data: true, Message: message})
}

func responseSuccessWithMessage(c echo.Context, message string) {
	c.JSON(http.StatusOK, Response{Code: http.StatusOK, Data: true, Message: message})
}

func responseErrUnauthorized(c echo.Context) {
	c.JSON(http.StatusUnauthorized, Response{Code: http.StatusUnauthorized, Message: http.StatusText(http.StatusUnauthorized)})
}

func responseErrValidation(c echo.Context, message string) {
	c.JSON(http.StatusUnprocessableEntity, Response{Code: http.StatusUnprocessableEntity, Message: message})
}

func responseErrInternalServerError(c echo.Context) {
	c.JSON(http.StatusInternalServerError, Response{Code: http.StatusInternalServerError, Message: http.StatusText(http.StatusInternalServerError)})
}

func responseErrInternalServerErrorWithDetail(c echo.Context, message string) {
	c.JSON(http.StatusInternalServerError, Response{Code: http.StatusInternalServerError, Message: message})
}

func responseErrNotFound(c echo.Context) {
	c.JSON(http.StatusNotFound, Response{Code: http.StatusNotFound, Message: http.StatusText(http.StatusNotFound)})
}
