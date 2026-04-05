from locust import HttpUser, task, between
import random

class NyunaUser(HttpUser):
    # Each fake user waits 1-2 seconds between requests
    wait_time = between(1, 2)

    # This runs when each fake user starts
    def on_start(self):
        # Shorten a URL first so we have something to redirect
        response = self.client.post("/shorten", json={
            "original_url": "https://www.google.com"
        })
        if response.status_code == 200:
            self.short_code = response.json()["short_code"]
        else:
            self.short_code = "b"

    # 70% of traffic = people clicking short links (redirects)
    @task(7)
    def redirect_url(self):
        self.client.get(
            f"/{self.short_code}",
            allow_redirects=False,
            name="/[short_code]"
        )

    # 20% of traffic = people shortening new URLs
    @task(2)
    def shorten_url(self):
        self.client.post("/shorten", json={
            "original_url": f"https://www.example{random.randint(1,1000)}.com"
        })

    # 10% of traffic = people checking analytics
    @task(1)
    def get_analytics(self):
        self.client.get(
            f"/analytics/{self.short_code}",
            name="/analytics/[short_code]"
        )