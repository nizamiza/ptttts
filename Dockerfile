# syntax = docker/dockerfile:1

FROM nginx:latest

COPY public /usr/share/nginx/html

# Expose port 80 to be able to access the site
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]

