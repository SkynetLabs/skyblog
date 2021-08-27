import React, { useContext } from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { SkynetContext } from "../state/SkynetContext";
import { Link } from "react-router-dom";

//Home page component, returns JSX to display
export default function Home(props) {
  const { userID, initiateLogin, isMySkyLoading } = useContext(SkynetContext); //use SkynetContext to determine Login status

  //Render basic information for user on homepage
  return (
    <Container maxWidth={false} style={{ width: "80%", margin: "0px auto", paddingTop: "50px" }}>
      <Box display={"flex"} justifyContent={"center"} style={{ margin: "20px", padding: "50px", border: "solid rgba(0, 0, 0, 0.12)", borderRadius: "3px"}}>
        <Typography variant={"h2"} gutterBottom={true} style={{ textAlign: "center"}}>
          Share Your Story Using the New Decentralized Internet.
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        {userID ? (
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
        ) : !isMySkyLoading ? (
          <Button
            size={"large"}
            color={"primary"}
            variant={"contained"}
            style={{ width: "30%" }}
            onClick={initiateLogin}
          >
            Login with MySky
          </Button>
        ) : null}
        <Button
          size={"large"}
          color={"secondary"}
          variant={"contained"}
          style={{ width: "30%", marginLeft: "10px" }}
          target={"_blank"}
          href={"https://siasky.net/"}
        >
          ... or Learn More
        </Button>
      </Box>
      <Divider style={{ margin: 28 }} />
      <Box display={"flex"} justifyContent={"center"}>
        <Typography variant={"h3"} gutterBottom={true}>
          Featured
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <Card>
          <CardContent>
            <Typography variant={"h5"} gutterBottom={true}>
              Manasi's Blog
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              As Web3 gains traction, we need more resources for onboarding Web2 to Web3. There are a ton of projects providing different pieces of the Web3 stack but it is sometimes hard to find a clear place to start. Additionally, Web3 projects can benefit from more easily accessible guides to decentralizing different pieces of their stack. Often, Web3 projects or “dapps” retain certain points of centralization that can be resolved if provided a streamlined solution.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Read More</Button>
          </CardActions>
        </Card>
      </Box>
    <br/>
    <br/>
    <br/>
    </Container>
  );
}
