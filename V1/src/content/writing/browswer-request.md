
# How a Browser Request Reaches a Backend Service

As a backend developer, I use localhost or different URLs everyday, without having full understanding of how things work all together. This article is my notes that explains what happens from the moment a user enters a URL in a browswer to the moment a backend service returns a response.

# At High Level
When I type a url into a browser, my browswer exracts the domain name and asks DNS to resolve it into an IP address. With the IP address, it opens a TCP connection. If the URL uses HTTPS, the browser perfroms a TLS handshake to secure the connection, then it sends the HTTP request over that connection. 

The request goes through CDN, load balancer, or API gateway which that connects to backend services. Once the backend service responses, it returns HTTP respnse back to the browser.


# DNS

DNS(Domain Name System) is mapped directory of IP addresses. When I type a url, then the browser asks DNS to convert the domain into IP address.

DNS resolves the domain name, not the full URL path

Given the following URL,
```
URL: https://api.example.com/users/123
```
DNS resolves only domain
```
domain: api.example.com 
->
IP: 123.250.11.22
```
and ignores
```
/user/123
```


# IP and PORT

DNS returns IP for domain which tells the browswer where to connect, and the port tells it which service to use.

```
123.250.11.22:443
```

Port
```
443 = HTTPS
80 = HTTP
```
After the browser knows the IP and port, it opens TCP connection. If the URL uses HTTPS, hen it performs TLS handshake to secure the connection, and then it sends HTTP request. 

If it uses HTTP, then it just send HTTP request without TLS.

TCP is to create reliable connection
TLS is to ecrypt the connection
HTTP is to send actual request

From HTTP:
HTTP -> TCP -> IP

From HTTPS:
HTTP -> TLS -> TCP -> IP

# CDN, Load Balancer, and Gateway

These three are all traffic hadling layers, but it solves differnet problems. 

CDN impvoes the speed by caching contents near user.

LB improves scalability and reliability by spreading traffic across healthy servers.

API gateway manages API behaviours things like authentication, rate limiting, and routing request to correct backend services.

If the site uses a CDN, the user's browser connects to a CDN edge server first. The CDN checks whether it already has a cached response. If it does, it returns the response directly. If not, it fowards the request to the LB/API gateway or backend server. 


# Summary

When a user enters a URL, the browser asks DNS to resolve the domain into an IP address. If the site uses CDN, it returns the IP of the nearby CDN edge server. The browser uses TCP to connect to the IP. If the url uses HTTPS, the browser creates TLS handshake to secure the connection, then sends the http request. Once the request hits CDN, it checks whether it has cached response. If it does, it returns the response. If not, it forwards the request to load balancers/API gateway, and/or backend service. And it returns the responses. 