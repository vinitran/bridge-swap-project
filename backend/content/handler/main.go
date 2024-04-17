package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/samber/do"
)

type Config struct {
	Container *do.Injector

	Origins []string
}

func New(cfg *Config) (http.Handler, error) {
	r := echo.New()

	r.IPExtractor = echo.ExtractIPFromXFFHeader()
	r.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${time_rfc3339}\t${method}\t${uri}\t${status}\t${latency_human}\n",
	}))
	r.Use(middleware.Recover())

	r.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello world")
	})
	routesAPIv1 := r.Group("/api/v1")
	{
		cors := middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins:     cfg.Origins,
			AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
			AllowCredentials: true,
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
			MaxAge:           60 * 60,
		})
		routesAPIv1.Use(cors)
	}

	groupBridge := &GroupBridge{cfg}
	{
		routesAPIv1.POST("/bridge", groupBridge.Exec)
	}
	groupFaucet := &GroupFaucet{cfg}
	{
		routesAPIv1.POST("/faucet", groupFaucet.Exec)
	}

	return r, nil
}
