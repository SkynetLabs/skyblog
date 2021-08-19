import React, { useContext } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { SkynetContext } from "../state/SkynetContext";
import { Link } from "react-router-dom";

export default function Home(props) {
  const { userID, initiateLogin } = useContext(SkynetContext); //use SkynetContext to determine Login status

  //Render basic information for user on homepage
  return (
    <Container maxWidth={false} style={{ padding: 20 }}>
      <Box display={"flex"} justifyContent={"center"}>
        <Typography variant={"h3"} gutterBottom={true}>
          Share your story using the new decentralized internet.
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        {userID != null && userID != "" ? (
          <Button
            size={"large"}
            color={"primary"}
            variant={"contained"}
            style={{ width: "30%" }}
            component={Link}
            to={"/create"}
          >
            Get started
          </Button>
        ) : (
          <Button
            size={"large"}
            color={"primary"}
            variant={"contained"}
            style={{ width: "30%" }}
            onClick={initiateLogin}
          >
            Login with MySky
          </Button>
        )}
      </Box>

      <Divider style={{ margin: 28 }} />

      <Box display={"flex"} justifyContent={"center"} style={{ margin: 20 }}>
        <img
          src={
            "https://siasky.net/NABosXa1JcBQngZeA4e43JgSfQti1nadqjMKPibH6cgcNg"
          }
          style={{ maxHeight: window.innerHeight * 0.15 }}
        />
      </Box>

      <Box display={"flex"} justifyContent={"center"}>
        <Typography variant={"h3"}>
          Learn more about how your blog is hosted on Skynet.
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Typography variant={"h6"} style={{ color: "gray" }}>
          Skynet prioritizes privacy and security to empower users.
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"center"} style={{ margin: 20 }}>
        <Button
          size={"large"}
          color={"primary"}
          variant={"contained"}
          style={{ width: "30%" }}
          target={"_blank"}
          href={"https://siasky.net/"}
        >
          Learn More
        </Button>
      </Box>
    </Container>
  );
}
