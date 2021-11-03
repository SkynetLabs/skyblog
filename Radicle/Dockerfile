# ! Step 1
# * To build and run a seed node, you'll have to install some prerequisites on your machine first:
# * Rust toolchain, you'll need Rust nightly, easiest way to set it up is via rustup
# * yarn
# * Next, clone and set up the radicle-bins repository:

# Use nightly build although that doesn't seem to make a difference
FROM rustlang/rust:nightly
# Logs in case of errors
ENV RUST_LOG=debug
# Install nodejs, cmake was also missing for some reason, git clone the radicle code.
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get -y install cmake && \
    git clone https://github.com/radicle-dev/radicle-bins.git

# ! Step 2
# * Install UI depependencies and build the UI:
# * Next, let's set up a directory where the seed can store its data. This is important in case you are running a Radicle Upstream client on the same machine. 
# * The default path for both Radicle Upstream and the seed node would otherwise be the same and could result in unexpected behaviour.

# Change to the ui directory to build the UI
WORKDIR /radicle-bins/seed/ui
# Build the UI and make a directory for the seed
RUN npm install && \
    npm run build && \
    mkdir /radicle-seed

# ! Step 3
# * Then, you'll have to generate a private key:

# Generate the radicle secret key. I made this a seperate step because it takes a long time
RUN cargo run -p radicle-keyutil -- --filename /radicle-seed/secret.key

# ! Step 4
# * In order for people to connect to the seed node from the internet, you'll have to allow incomming connections for the following ports:

# * UDP:12345 - for peer data exchange
# * TCP:80 - for the seed node UI


# Radicle seed node connects to peers on 12345
EXPOSE 12345
# Port 80 is the UI
EXPOSE 80

# ! Step 5
# * Now you're ready to start the seed node. Let's return to the radicle-bins folder cd ~/radicle-bins and configure it to listen on ports 12345 and 80 on all interfaces, the private key is supplied via STDIN:

CMD cargo run -p radicle-seed-node \
    --release -- --root /radicle-seed \
    --peer-listen 0.0.0.0:12345 \
    --http-listen 0.0.0.0:80 \
    --public-addr 'services.siasky.tech:12345' \
    --assets-path /radicle-bins/seed/ui/public \
    --secret-key /radicle-seed/secret.key \
    --bootstrap 'hynkyndc6w3p8urucakobzna7sxwgcqny7xxtw88dtx3pkf7m3nrzc@sprout.radicle.xyz:12345'

