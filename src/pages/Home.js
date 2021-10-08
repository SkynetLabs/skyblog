import React, { useContext, useEffect, useState } from "react";
import { SkynetContext } from "../state/SkynetContext";
import BlogPreviewProfile from "../components/BlogPreviewProfile";
import { loadBlogPost } from "../data/feedLibrary";
import Spinner from "../components/Spinner";

const features = [
  "sky://ed25519-fed72531c20cb5795a13e4cab4fe026e8d69dfc0397424a208330122c36b864a/feed-dac.hns/100dcbhbr4ogv1rucfecaud33lq2da6d2ot4jhnfmag8aqf2irh44tg/posts/page_0.json#0",
];

//Home page component, returns JSX to display
export default function Home(props) {
  const { isMySkyLoading, feedDAC, client } = useContext(SkynetContext); //use isMySkyLoading, feedDAC and client to get featured
  const [featureFeed, setFeatureFeed] = useState([]); //featured stories array
  const [isLoading, setLoading] = useState(true); //loading state
  useEffect(() => {
    if (!isMySkyLoading && feedDAC.connector) {
      const getFeatured = async () => {
        let feed = [];
        features.forEach((item) => {
          loadBlogPost(item, feedDAC, client, true, true).then((res) => {
            feed.push(res);
            if (feed.length === features.length) {
              setFeatureFeed(feed);
              setLoading(false);
            }
          });
        });
      };
      getFeatured();
    }
  }, [isMySkyLoading, feedDAC, client]);

  //Render basic information for user on homepage
  return (
    <div className="py-10 flex-1">
      <header>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-sm sm:text-base font-semibold text-primary tracking-wide uppercase">
                Own Your Web
              </h2>
              <p className="mt-1 text-3xl font-extrabold text-palette-600 sm:text-4xl sm:tracking-tight lg:text-5xl">
                Share your story using the new decentralized internet.
              </p>
              <div className="max-w-xl mt-5 mx-auto text-base sm:text-xl text-palette-400 space-y-1 md:space-y-2 font-content">
                <p>Create and manage your blogs in one place.</p>
              </div>
              <div className={"flex items-center justify-center mt-4"}>
                <a
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={
                    "https://homescreen.hns.siasky.net/#/skylink/AQB5KpKxX_5Yr6VM5gihAnOcA6JnPf1JQLkkYCexLW-LSA"
                  }
                >
                  <img src="/logo/homescreen.svg" alt="Add to Homescreen" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="py-12 bg-white">
          <div className="md:max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className={"mb-4"}>Featured Stories</h1>
            {!isLoading ? (
              <ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                {featureFeed.map((item) => (
                  <li key={item.ref}>
                    <BlogPreviewProfile
                      post={item}
                      feedDAC={feedDAC}
                      isMine={false}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <Spinner text={"Loading Featured"} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
