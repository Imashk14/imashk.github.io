document.getElementById("search").addEventListener("click", function() {
  let location = document.getElementById("city").value;
  if (!location) return;

  const apiKey = "4d08b05f61c91318d6566f6e35305732";
  let query = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  // XMLHttpRequest for Current Weather
  let xhr = new XMLHttpRequest();
  xhr.open("GET", query, true);

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      let weatherData = JSON.parse(xhr.responseText);

      let currentWeather = document.getElementById("current");
      let cityTime = new Date((weatherData.dt + weatherData.timezone) * 1000);

      let day = cityTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
      let time = cityTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

      let iconCode = weatherData.weather[0].icon;
      let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      let sunriseDate = new Date((weatherData.sys.sunrise + weatherData.timezone) * 1000);
      let sunrise = sunriseDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

      let sunsetDate = new Date((weatherData.sys.sunset + weatherData.timezone) * 1000);
      let sunset = sunsetDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

      let mainWeather = weatherData.weather[0].main.toLowerCase();
      let bgClass = "bg-default";

      if (mainWeather === "clear") bgClass = "bg-clear";
      else if (mainWeather === "clouds") bgClass = "bg-clouds";
      else if (mainWeather === "rain" || mainWeather === "drizzle") bgClass = "bg-rain";
      else if (mainWeather === "snow") bgClass = "bg-snow";
      else if (mainWeather === "thunderstorm") bgClass = "bg-thunderstorm";
      else if (["mist", "smoke", "haze", "dust", "fog", "sand", "ash", "squall", "tornado"].includes(mainWeather)) bgClass = "bg-fog";

      document.body.className = bgClass;

      currentWeather.innerHTML = `
        <div class="card-header">
          <div class="location">${weatherData.name}</div>
          <div class="datetime">${day} • ${time}</div>
        </div>
        <div class="card-body">
          <img class="weather-icon" src="${iconUrl}" alt="${weatherData.weather[0].description}">
          <div class="temp-section">
            <div class="temp-main">${Math.round(weatherData.main.temp)}°</div>
            <div class="temp-feels">feels ${Math.round(weatherData.main.feels_like)}°</div>
          </div>
        </div>
        <div class="card-footer">
          <div class="info-chip">
            <span class="label">Humidity</span>
            <span class="value">${weatherData.main.humidity}%</span>
          </div>
          <div class="info-chip">
            <span class="label">Wind</span>
            <span class="value">${Math.round(weatherData.wind.speed)} m/s</span>
          </div>
          <div class="info-chip">
            <span class="label">Pressure</span>
            <span class="value">${weatherData.main.pressure} hPa</span>
          </div>
        </div>
        <div class="card-details">
          <div class="info-chip">
            <span class="label">Sunrise</span>
            <span class="value">${sunrise}</span>
          </div>
          <div class="info-chip">
            <span class="label">Sunset</span>
            <span class="value">${sunset}</span>
          </div>
          <div class="info-chip">
            <span class="label">Clouds</span>
            <span class="value">${weatherData.clouds.all}%</span>
          </div>
        </div>
      `;
    } else {
      console.error("Request failed with status:", xhr.status);
    }
  };

  xhr.onerror = function() {
    console.error("Network error while fetching weather data.");
  };

  xhr.send();

  // Fetch API for Forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== "200") return;

      const tz = data.city.timezone;
      let dailyForecasts = {};
      let currentLocalDate = new Date((Date.now() / 1000 + tz) * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

      data.list.forEach(item => {
        let localDateObj = new Date((item.dt + tz) * 1000);
        let forecastDate = localDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

        if (forecastDate === currentLocalDate) return;

        let forecastTime = localDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });

        if (!dailyForecasts[forecastDate]) dailyForecasts[forecastDate] = [];
        dailyForecasts[forecastDate].push({ time: forecastTime, data: item, hour: localDateObj.getUTCHours() });
      });

      let forecastDays = Object.entries(dailyForecasts).slice(0, 5);
      let weatherCards = document.querySelectorAll(".weatherCard:not(#current)");

      for (let i = 0; i < Math.min(5, forecastDays.length); i++) {
          if (!weatherCards[i]) break;
          let [date, timesData] = forecastDays[i];
          let dayName = new Date((timesData[0].data.dt + tz) * 1000).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });

          let mainForecast = timesData[Math.floor(timesData.length / 2)];
          let targetHours = [8, 11, 14, 17, 20];
          let selectedTimes = [];

          for (let targetHour of targetHours) {
            let closestEntry = null;
            let minDiff = Infinity;
            for (let entry of timesData) {
              let diff = Math.abs(entry.hour - targetHour);
              if (diff < minDiff) { minDiff = diff; closestEntry = entry; }
            }
            if (closestEntry && !selectedTimes.includes(closestEntry)) selectedTimes.push(closestEntry);
          }

          let timeEntriesHtml = selectedTimes.map(entry => `
              <div class="time-entry">
                <img src="https://openweathermap.org/img/wn/${entry.data.weather[0].icon}.png" alt="weather" style="width: 40px; height: 40px;">
                <div class="time-label">${entry.time}</div>
                <div class="time-temp">${Math.round(entry.data.main.temp)}°</div>
              </div>
          `).join("");

          let mainIconUrl = `https://openweathermap.org/img/wn/${mainForecast.data.weather[0].icon}@2x.png`;

          weatherCards[i].innerHTML = `
            <div class="forecast-header">
              <div class="forecast-day">${dayName}</div>
              <div class="forecast-date">${date}</div>
            </div>
            <div class="forecast-main">
              <img src="${mainIconUrl}" alt="weather" style="width: 50px; height: 50px;">
              <div class="main-info">
                <div class="main-temp">${Math.round(mainForecast.data.main.temp)}°</div>
                <div class="main-desc">${mainForecast.data.weather[0].description}</div>
              </div>
            </div>
            <div class="forecast-times">
              ${timeEntriesHtml}
            </div>
          `;
      }
    })
    .catch(error => {
      console.error("Error fetching forecast data:", error);
    });
});

document.getElementById("city").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});
