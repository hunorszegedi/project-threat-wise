import geoip2.database

geo_db_path = 'C:/Users/Vivobook/Downloads/GeoLite2-City_20241105/GeoLite2-City_20241105/GeoLite2-City.mmdb'

reader = geoip2.database.Reader(geo_db_path)

def get_geolocation(ip):
    try:
        response = reader.city(ip)
        return {
            'country': response.country.name,
            'region': response.subdivisions.most_specific.name,
            'city': response.city.name,
            'latitude': response.location.latitude,
            'longitude': response.location.longitude
        }
    except geoip2.errors.AddressNotFoundError:
        return {
            'country': 'Unknown',
            'region': 'Unknown',
            'city': 'Unknown',
            'latitude': None,
            'longitude': None
        }

ip_address = '1.70.158.32'
geolocation = get_geolocation(ip_address)
print(f"Geolocation for {ip_address}: {geolocation}")

reader.close()
