FROM rust:1.43 as builder
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN git clone https://github.com/radicle-dev/radicle-bins.git
WORKDIR radicle-bins/seed/ui
RUN npm install
RUN mkdir -p ~/.radicle-seed
RUN cargo run -p radicle-keyutil -- --filename ~/.radicle-seed/secret.key
EXPOSE 12345
EXPOSE 80
CMD cargo run -p radicle-seed-node --release -- --root ~/.radicle-seed --peer-listen 0.0.0.0:12345 --http-listen 0.0.0.0:80 --public-addr 'services.siasky.tech:12345' --assets-path seed/ui/public < ~/.radicle-seed/secret.key

