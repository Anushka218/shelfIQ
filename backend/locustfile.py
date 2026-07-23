from locust import HttpUser, task, between


class ShelfIQUser(HttpUser):
    wait_time = between(1, 3)

    @task(10)
    def products(self):
        self.client.get("/api/products")

    @task(8)
    def search(self):
        self.client.get("/api/search?q=laptop")

    @task(4)
    def trends(self):
        self.client.get("/api/trends/Lucknow")

    @task(3)
    def shelf(self):
        self.client.get("/api/shelf/Lucknow")

    @task(1)
    def seller_dashboard(self):
        self.client.get(
            "/seller/dashboard",
            params={"region": "Lucknow"},
        )