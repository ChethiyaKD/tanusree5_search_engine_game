import React, { useState, useEffect } from "react";
import { sendMessage, getFromStorage } from "../actions/actions.js";
import ErrorPopup from "../components/ErrorPopup.js";

import "../styles/views/home.scss";

import googleImg from "../assets/images/google.png";
import seachIcon from "../assets/images/magnifier.svg";
import loadingIcon from "../assets/images/loading-small.svg";

export default function Search({
  setSelected,
  setData,
  setIsResult,
  setLastKeyword,
  noAccess,
  setNoAccess,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const staticResult = [
    {
      position: 1,
      title: "Coffee - Wikipedia",
      link: "https://en.wikipedia.org/wiki/Coffee",
      displayed_link: "https://en.wikipedia.org › wiki › Coffee",
      thumbnail:
        "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de33f1075c739f8422a9f36bd05bdd0ca9f.jpeg",
      snippet:
        "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain flowering plants in the Coffea genus. From the coffee fruit, ...",
      snippet_highlighted_words: ["Coffee", "coffee", "coffee"],
      sitelinks: {
        inline: [
          {
            title: "Coffee bean",
            link: "https://en.wikipedia.org/wiki/Coffee_bean",
          },
          {
            title: "History",
            link: "https://en.wikipedia.org/wiki/History_of_coffee",
          },
          {
            title: "Coffee preparation",
            link: "https://en.wikipedia.org/wiki/Coffee_preparation",
          },
          {
            title: "Coffee production",
            link: "https://en.wikipedia.org/wiki/Coffee_production",
          },
        ],
      },
      rich_snippet: {
        bottom: {
          extensions: [
            "Region of origin: Horn of Africa and ‎South Ara...‎",
            "Color: Black, dark brown, light brown, beige",
            "Introduced: 15th century",
          ],
          detected_extensions: {
            introduced_th_century: 15,
          },
        },
      },
      about_this_result: {
        source: {
          description:
            "Wikipedia is a multilingual free online encyclopedia written and maintained by a community of volunteers through open collaboration and a wiki-based editing system. Individual contributors, also called editors, are known as Wikipedians. Wikipedia is the largest and most-read reference work in history.",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3a991c60432db4437d53a378874df5fd3c8eee73e16e6b2baf77aba3b1336b6b6.png",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://en.wikipedia.org/wiki/Coffee&tbm=ilp&ilps=ADNMCi0tVhSB-fGHOJYgrIxB0xlXYrPGPA",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:U6oJMnF-eeUJ:https://en.wikipedia.org/wiki/Coffee+&cd=14&hl=en&ct=clnk&gl=us",
      related_pages_link:
        "https://www.google.com/search?q=related:https://en.wikipedia.org/wiki/Coffee+Coffee",
    },
    {
      position: 2,
      title: "The Coffee Bean & Tea Leaf | CBTL",
      link: "https://www.coffeebean.com/",
      displayed_link: "https://www.coffeebean.com",
      snippet:
        "Born and brewed in Southern California since 1963, The Coffee Bean & Tea Leaf® is passionate about connecting loyal customers with carefully handcrafted ...",
      snippet_highlighted_words: ["Coffee"],
      about_this_result: {
        source: {
          description:
            "The Coffee Bean & Tea Leaf is an American coffee shop chain founded in 1963. Since 2019, it is a trade name of Ireland-based Super Magnificent Coffee Company Ireland Limited, itself wholly owned subsidiary of multinational Jollibee Foods Corporation.",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de37f4dd49485528fe7b21de475d2107126d1322bc34dca9b3f60f1c42148ce2d4e.png",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.coffeebean.com/&tbm=ilp&ilps=ADNMCi2oSYB5WqnhmnflS86OdMdpjMzz9g",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:WpQxSYo2c6AJ:https://www.coffeebean.com/+&cd=15&hl=en&ct=clnk&gl=us",
      related_pages_link:
        "https://www.google.com/search?q=related:https://www.coffeebean.com/+Coffee",
    },
    {
      position: 3,
      title: "The History of Coffee - National Coffee Association",
      link: "https://www.ncausa.org/about-coffee/history-of-coffee",
      displayed_link: "https://www.ncausa.org › ... › History of Coffee",
      snippet:
        "Coffee grown worldwide can trace its heritage back centuries to the ancient coffee forests on the Ethiopian plateau. There, legend says the goat herder ...",
      snippet_highlighted_words: ["Coffee", "coffee"],
      sitelinks: {
        inline: [
          {
            title: "An Ethiopian Legend",
            link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=An%20Ethiopian%20Legend",
          },
          {
            title: "The Arabian Peninsula",
            link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=The%20Arabian%20Peninsula,-Coffee%20cultivation%20and%20trade%20began",
          },
          {
            title: "Coffee Comes To Europe",
            link: "https://www.ncausa.org/about-coffee/history-of-coffee#:~:text=Coffee%20Comes%20to%20Europe",
          },
        ],
      },
      about_this_result: {
        source: {
          description:
            "The National Coffee Association or, is the main market research, consumer information, and lobbying association for the coffee industry in the United States.",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.ncausa.org/about-coffee/history-of-coffee&tbm=ilp&ilps=ADNMCi2T6KU_7eHEV4EzZS1EnLrQVwD53A",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:v1hp0SS8WggJ:https://www.ncausa.org/about-coffee/history-of-coffee+&cd=16&hl=en&ct=clnk&gl=us",
    },
    {
      position: 4,
      title: "9 Health Benefits of Coffee, Based on Science - Healthline",
      link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee",
      displayed_link:
        "https://www.healthline.com › nutrition › top-evidence-b...",
      snippet:
        "Coffee is a major source of antioxidants in the diet. It has many health benefits, such as improved brain function and a lower risk of several diseases.",
      snippet_highlighted_words: ["Coffee"],
      sitelinks: {
        inline: [
          {
            title: "1. Boosts Energy Levels",
            link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=1.%20Boosts%20energy%20levels",
          },
          {
            title: "2. May Be Linked To A Lower...",
            link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=2.%20May%20be%20linked%20to%20a%20lower%20risk%20of%20type%202%20diabetes",
          },
          {
            title: "3. Could Support Brain...",
            link: "https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee#:~:text=3.%20Could%20support%20brain%20health",
          },
        ],
      },
      about_this_result: {
        source: {
          description:
            "Healthline Media, Inc. is an American website and provider of health information headquartered in San Francisco, California. It was founded in its current form 2006 and established as a standalone entity in January 2016.",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de339c2b8dc2d17f23567c77e0bbc2f014386fb25182a64ce9fe79002d3e19a37e4.png",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee&tbm=ilp&ilps=ADNMCi005zP34LoVlgtSYcT3k6ep4HgZPQ",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:r1UW6FGz3F4J:https://www.healthline.com/nutrition/top-evidence-based-health-benefits-of-coffee+&cd=17&hl=en&ct=clnk&gl=us",
    },
    {
      position: 5,
      title: "coffee | Origin, Types, Uses, History, & Facts | Britannica",
      link: "https://www.britannica.com/topic/coffee",
      displayed_link: "https://www.britannica.com › ... › Food",
      date: "May 17, 2022",
      snippet:
        "coffee, beverage brewed from the roasted and ground seeds of the tropical evergreen coffee plants of African origin. Coffee is one of the ...",
      snippet_highlighted_words: ["coffee", "coffee", "Coffee"],
      about_this_result: {
        source: {
          description:
            "britannica.com was first indexed by Google more than 10 years ago",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3d94b9642f9e73eae53139d628085d840c483d7851a2d359fa0ad991302dd4dc3.png",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.britannica.com/topic/coffee&tbm=ilp&ilps=ADNMCi0xG2ABk5g9BrBwiawxBsBHMAwr8A",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:Wikbu4ipU28J:https://www.britannica.com/topic/coffee+&cd=18&hl=en&ct=clnk&gl=us",
      related_pages_link:
        "https://www.google.com/search?q=related:https://www.britannica.com/topic/coffee+Coffee",
    },
    {
      position: 6,
      title: "Peet's Coffee: The Original Craft Coffee",
      link: "https://www.peets.com/",
      displayed_link: "https://www.peets.com",
      snippet:
        "Since 1966, Peet's Coffee has offered superior coffees and teas by sourcing the best quality coffee beans and tea leaves in the world and adhering to strict ...",
      snippet_highlighted_words: ["Coffee", "coffees", "coffee"],
      about_this_result: {
        source: {
          description:
            "Peet's Coffee is a San Francisco Bay Area-based specialty coffee roaster and retailer owned by JAB Holding Company via JDE Peet's.",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de37df725a437f7ce9737eb1dd6b39997770635523bf5e28f914a51454c2769e162.png",
        },
        keywords: ["coffee"],
        related_keywords: ["coffees"],
        languages: ["English"],
        regions: ["California"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.peets.com/&tbm=ilp&ilps=ADNMCi2xqgiMSzEyTwg-QewuVQYGctzClw",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:BCjzno6zP6wJ:https://www.peets.com/+&cd=19&hl=en&ct=clnk&gl=us",
      related_pages_link:
        "https://www.google.com/search?q=related:https://www.peets.com/+Coffee",
    },
    {
      position: 7,
      title: "Starbucks Coffee Company",
      link: "https://www.starbucks.com/",
      displayed_link: "https://www.starbucks.com",
      snippet:
        "More than just great coffee. Explore the menu, sign up for Starbucks® Rewards, manage your gift card and more.",
      snippet_highlighted_words: ["coffee"],
      about_this_result: {
        source: {
          description:
            "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves headquartered in Seattle, Washington. It is the world's largest coffeehouse chain.\nAs of November 2021, the company had 33,833 stores in 80 countries, 15,444 of which were located in the United States.",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3ad916b247a53360f0877bed9eba55dd7f02f4cc3b02948c98349d227b7e0c3a1.png",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.starbucks.com/&tbm=ilp&ilps=ADNMCi0cMyV0H7KdBl4d_vac7u0R1ouGYg",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:1vGXgo_FlHkJ:https://www.starbucks.com/+&cd=20&hl=en&ct=clnk&gl=us",
      related_pages_link:
        "https://www.google.com/search?q=related:https://www.starbucks.com/+Coffee",
    },
    {
      position: 8,
      title: "Coffee | The Nutrition Source",
      link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/",
      displayed_link: "https://www.hsph.harvard.edu › ... › Food Features",
      snippet:
        "Coffee beans are the seeds of a fruit called a coffee cherry. Coffee cherries grow on coffee trees from a genus of plants called Coffea. There are a wide ...",
      snippet_highlighted_words: ["Coffee", "coffee", "Coffee", "coffee"],
      sitelinks: {
        inline: [
          {
            title: "Coffee And Health",
            link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=Coffee%20and%20Health",
          },
          {
            title: "Types",
            link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=Types,-Coffee%20beans%20are%20the%20seeds",
          },
          {
            title: "Make",
            link: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/#:~:text=",
          },
        ],
      },
      about_this_result: {
        source: {
          description:
            "The Harvard T.H. Chan School of Public Health is the public health school of Harvard University, located in the Longwood Medical Area of Boston, Massachusetts.",
          icon: "https://serpapi.com/searches/62c1ba9ef55d774dfd018a03/images/b7cc67a2b78dbb467fd73da3a5c83de3229aae72459d52def89429ddcb1d5343f77deb2f4657de73e4f71607635e3ae3.png",
        },
        keywords: ["coffee"],
        languages: ["English"],
        regions: ["the United States"],
      },
      about_page_link:
        "https://www.google.com/search?q=About+https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/&tbm=ilp&ilps=ADNMCi3F4RO_DIqjcm9VUCXmfmpqrX5h3w",
      cached_page_link:
        "https://webcache.googleusercontent.com/search?q=cache:aCQFR0EWgPwJ:https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/+&cd=24&hl=en&ct=clnk&gl=us",
    },
  ];

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyUp = async (e) => {
    if (e.key != "Enter") return;
    setIsLoading(true);
    let storageRes = await getFromStorage([
      "history",
      "weekTwoKeywords",
      "whitelistedKeywords",
    ]);
    let isAKeyword = storageRes.weekTwoKeywords.find((k) =>
      k.keywords.find((kws) =>
        searchTerm.toLowerCase().includes(kws.toLowerCase())
      )
    );
    console.log({ isAKeyword });
    let isSubmitted = storageRes.history.find((h) => h.submitted);

    if (!isSubmitted && isAKeyword) {
      console.log(1);
      setLastKeyword(isAKeyword); //whitelist keyword
      setData([...staticResult]); // show static result
      setIsResult(true);
      return setNoAccess(true);
    }
    if (
      isSubmitted &&
      !storageRes.whitelistedKeywords.find((kw) =>
        kw.find((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ) {
      console.log(2);
      setLastKeyword(isAKeyword); //whitelist keyword
      setData([...staticResult]); // show static result
      setIsResult(true);
      return setNoAccess(true);
    }
    console.log(3);
    let res = await sendMessage({ command: "search", data: searchTerm });
    console.log(res);
    setData([...res]);
    setNoAccess(false);
    setIsResult(true);
  };

  return (
    <div className="view-container search">
      {noAccess && <ErrorPopup setSelected={setSelected} />}
      <img src={googleImg} alt="" className="google-logo" />
      <div className="search-box">
        <img src={seachIcon} alt="" />
        <input
          type="text"
          className="search-input"
          onChange={(e) => handleSearchInput(e)}
          onKeyUp={(e) => handleKeyUp(e)}
        />
        {isLoading && (
          <img src={loadingIcon} className="search-loading" alt="" />
        )}
      </div>
    </div>
  );
}
