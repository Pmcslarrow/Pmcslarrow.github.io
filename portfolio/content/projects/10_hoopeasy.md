---
title: "HoopEasy"
description: ""
date: 2024-05-01
tags: ["React", "Javascript", "Node.js", "Docker", "SQL", "Railway", "Fullstack"]
weight: 11
---

## Github Link
- Original draft: [https://github.com/Pmcslarrow/hoop-easy](https://github.com/Pmcslarrow/hoop-easy)
- Refactor: [https://github.com/Pmcslarrow/hoop-easy-material-ui/](https://github.com/Pmcslarrow/hoop-easy-material-ui/)

## Overview
The document below is my README file within my [GitHub repo](https://github.com/Pmcslarrow/hoop-easy-material-ui/) for the refactoring of HoopEasy. The project is an application designed to help people easily find pickup basketball games near them, while also using an ELO system to track global rankings. Although it was never fully marketed or widely adopted, this was my first large-scale full-stack project completed during undergrad. It was a rewarding experience that brought together many of the skills I had learned.

Below you will find the first draft of HoopEasy (also found in a demo at this [link](https://youtu.be/HxctMFg9pFY)).

The GitHub repository implements optimizations to enhance memory efficiency through strategic use of React's useCallback hook and improves the overall user interface for better usability.

## Introduction

---

*HoopEasy is an application built for the basketball community to help find pickup games near you, and in the process, climb the global rank ladder to the top.*

In roughly three months, I worked with two students in the MBA program at Willamette University on a new venture, HoopEasy. While HoopEasy is hosted online and fully functioning, I feel a sense of responsibility as a developer to focus on the quality of the product. With this in mind, I've concluded that the overhead memory of the application is too high, primarily due to the overuse of JSX and poorly utilized React hooks.

Reflecting on the project, I am extremely proud to have created a full-stack application from scratch without relying on someone else’s YouTube tutorial. However, it's clear that the efficiency came with some consequences. My new goal is to recreate HoopEasy behind the scenes while the MBA students focus on establishing a user base. In doing so, I will learn from my mistakes and aim to use UI libraries, as well as limit unnecessary re-renders.

Despite feeling empowered to use raw JSX and CSS to develop the entire application in the old version, the reality is that there are UI libraries available that I can leverage to create a similar application with less overhead memory. I will be using Material UI’s (MUI) library to recreate HoopEasy in a way that is still reactive, easier for users to navigate, and has lower overhead memory.

***I am pleased to report that in only 2-3 weeks, I successfully recreated almost the same concept as in the old version, but reimagined to enhance user experience and alleviate the memory usage issue that initiated this journey. The memory has officially been reduced from around 500 MB on average to between 57 MB and 103 MB.***


## Theming

---

To begin, I had to get a good theme created that wraps every route to the application (that we have so far). In doing so, we leverage MUI’s theming abilities to create the color, typography, and more that hold the overall theme structure together.
```javascript
const theme = createTheme({
    palette: {
        primary: {
            main: '#1d3557',
            contrastText: '#fff',
          },
          secondary: {
            main: '#1d3557',
            darkBlue: '#457b9d',
            lightBlue: '#a8dadc',
            lightRed: '#ee747e',
            red: '#e63946'
          },
    },
    typography: {
        fontFamily: 'Quicksand',
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 700
    },
    spacing: 10,
})
```


## Authentication

---

Looking back at the code I wrote early on in the authentication process, it was confusing. I was writing my javascript in a C-like format where functions return nullish values when they fail, and otherwise return back the data. Saying this outloud I realized that Javascript has functionality for this out of box that could make the code more precise, and in which handles errors well — Promises. This was fixed for both login and createAccount. We will draw examples from creating a new user.

### Old handling (no promises)
```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty()) {
        return
    }
    if ( passwordsDontMatch() ) {
        return
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      addNewUser();
      await sendEmailVerification(userCredential.user);
      setMessage("Please verify your email.");
      setError(true);
  
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      handleError(setError, setMessage, err);
    }
  };
  ```

  ### New handling (promises)
  ```javascript
  async function createNewUser(first, last, username, email, password) {
    return new Promise((resolve, reject) => {
        if (isEmpty([first, last, username, email, password])) {
            reject(new Error("Empty fields"))
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                addNewUserToDatabase(first, last, username, email, password)
                resolve(userCredentials)
                sendEmailVerification(userCredentials.user)
            })
            .catch((err) => {
                reject(new Error("Failed to create new user"))
            })
   

const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await createNewUser(
        data.get('firstName'),
        data.get('lastName'),
        data.get('username'),
        data.get('email'),
        data.get('password'),
    )
    .then(() => {
        navigate('/')
    }).catch((res) => {
        console.log(res)
    })
  };
  ```

  ### New vs. Old Authentication UI Comparison
  ![Screenshot 2024-04-22 at 9 38 19 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/8f585959-94eb-437b-89d5-4ca4058ce92d)
  ![Screenshot 2024-04-22 at 9 39 03 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/f172a3a0-f584-4d01-ae8e-99bb703f4e53)



## Homepage
---

While the homepage which holds all the core functionality is simple, I believe that we can improve it. The homepage has three key components: How to play, My Games, and History. The page was a more inefficient version of functionality to go through the steps of creating, finding, playing, and submitting game results.

Instead of having three components that take up 100% of the viewport height each, I am going to give the page a dashboard sort of feel. A central hub where you can do the same things as the old version of the app, but more condensed.
![Screenshot 2024-04-22 at 9 39 44 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/3bd4e0e4-2c4a-4b58-a9af-585487a2d227)
![Screenshot 2024-04-22 at 9 29 00 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/0d809dd2-a5a2-45fd-a5a8-e5a9dcf0f86d)
We will start with the general statistics components and what was changed in order to drive efficiency.



## General Statistics
---

The general statistics component is used as the replacement for the rankings page that existed on the original HoopEasy app. The new version uses MaterialUI’s built in Pagination system to make the component more compact and elegant at once. At the top left of the entire wrapped component, the overall rating is shown, rather than staying sticky at the bottom left of the user’s screen at all times. One area where I focused on improvements in my code was in the overcalculation of certain parameters (getting user ID, getting overall rating, calculating ranks in line…). In the old version of the application, I would go through the process of fetching the current user ID and then plugging this user ID into another fetch call which would get the users overall rating… This was a waste of resources. Instead, I knew that the overall rating was attached to each user profile, and we are using useContext at the top level of the application to hold the user’s information and then pass props with it later on in the homepage. Given this information, I instead used useEffect and passed in the [user] as one of the dependencies to refresh all of the data for, so that when there was a reason for the user’s information to update on the page (say the user won a game and their overall rating increased), then the useEffect would re-fetch the updated user information this way once instead of multiple times. The same logic I just described is the backbone of the improvement of code for nearly each component. Instead of unnecessary re-rendering from the old code, I managed to improve these unnecessary calls with the use of native React hooks. The other thing that I noticed was using wasted overhead memory, was the location in which each element was called. In the old version, I had each individual component become a sibling or a child of one parent component. This meant that whenever the most important parent component re-rendered, it automatically would re-render the components down the DOM tree which was not necessary.

### Old Code

You can’t see it in one copy, however, the currentUserID was calculated in the parent component useEffect, and forced a re-render of the PlayerOverallRating without regards to when it should actually re-render. We also made a point earlier that we would move towards using more error handling instances in the code. And rather than holding the user, and the userID separately, we made sure to use one User which we could draw our information from.

```javascript
const PlayerOverallRating = ({currentUserID, refreshToken}) => {
    const [overallRating, setOverallRating] = useState(null)

    useEffect(() => {
        const getOverallRating = async () => {
            const response = await axios.get(`https://hoop-easy-production.up.railway.app/api/getUserWithID?userID=${currentUserID}`)
            setOverallRating(parseFloat(response.data.overall).toFixed(2))
        }

        getOverallRating()
    }, [refreshToken])
  ```

### New Code
The new code only re-renders on a manaul refresh. This seems very similar to the old version, but the major difference is that it does not force re-renders anymore for multiple other components when this happens, it only manually adjust a select handful.

```javascript
useEffect(() => {
	getUser(user?.email)
}, [refresh]) 

/* Inside App.js */
const getUser = React.useCallback(async (email) => {
	try {
	  const response = await axios.get(`https://hoop-easy-production.up.railway.app/api/getUser?email=${email}`);
    setCurrentUser(response.data);
  } catch(err) {
    console.error(err);
  }
}, []);
```

## My Games
---

The updated version of the My Games component uses multiple different ideas in order to drive efficiency with regards to memory, and efficiency in how it will make it easier for the user experience. Two new components exist at the top to give the user an easy way to view how many games they have coming up, or that they have past (probably meaning that they played this game and need to submit scores and verify). Rather than having to use the slider from the older version to find your games, we make sure to re-use the same component used for the General Statistics component, with different data and headers that are passed in. In doing so, we remove any wasted overhead memory that didn’t need to be used. Another way that we reused components was with the Dialog modal we will talk about directly after this section.

With regards to the user experience, we made sure to let the user hover over elements of this list (which become highlighted light blue) and in which they can click, to open up the form for submitting game information. This modal is one of the most important components in the application, because we re-use it in three key circumstances to reduce any waste in our code; these components include the ScoreInputComponent, VerifyScoreComponent, and CreateGameForm, all used from this one component.

![Screenshot 2024-04-22 at 9 31 42 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/b9311ac3-f6e1-43a7-bcda-a3bd44cd98df)


### Submitting Scores

When clicked, the user is able to submit scores and captains of the game in a very familiar way to the previous application, except use a single form rather than a three step drawer that used up lots of memory in the previous app:
![Screenshot 2024-04-22 at 9 32 05 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/7825c073-679b-49e8-9dee-45154bc396e8)


### Verifying Scores

As much as we loved the design of the old card in this stage, we needed to remove the @vis.gl/react-google-maps API as it was causing too long of renders shown from the React Profiler built into Google Chrome to analyze efficiency in our components. While we ended up using vis.gl for the large map discussed later on, it was wasted overhead memory having multiple list view items containing their own map components each, which would all have too long of re-renders everytime the user adjusted data, or their screen size on the old version. Removing it only made sense. 

Using the same table and modal to enforce familiarity in the application, we implement a very similar logic system from the old to the new version for this step, except that we cannot show Accept and Deny inside the table so we use the Dialog modal again:
![Screenshot 2024-04-22 at 9 41 14 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/f6c0c325-4e47-4d18-ab7b-12090c2861a3)
![Screenshot 2024-04-22 at 9 41 37 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/8534e5b5-a66f-401e-aad1-f8add671c568)

When the second captain verifies the game, it goes through the process of using our manual refresh mentioned earlier, which will then re-render the three main components of the application because it is the instance that requires a change in every component on the page, which is expected.



### Under the Hood

We have discussed the high level user understanding of what is expected from each component. Now it is appropriate to discuss a few of the code examples that were adjusted under the hood, in order to drive efficiency in the refactor of HoopEasy.

The first thing that we must describe is how we actually re-use the two same components (General Statistics and My Games) at the top of the page, with different data. We accomplish this by using a single wrapper that takes in some props as a parameter with the data that should be filled in accordingly. It takes in GridAttributes, which contain the title of the page, and the data that should go into the two blue boxes at the top, and then the data to fill the table.

  
```javascript
// GridAttributes which are passed in for My Games
const AttRight = {
        title: 'My Games',
        blockOneTitle: 'Upcoming',
        blockOneValue: upcomingGamesCount,
        blockTwoTitle: 'Past',
        blockTwoValue: gamesPlayedCount,
        component: <CustomPaginationActionsTable rows={myGames ?? [{name: 'empty', overall: 'empty', rank: 'empty', gamesPlayed: 'empty'}]} columnNames={myGamesCols} isMyGames={true} user={user} setRefresh={setRefresh} refresh={refresh}/>,
}

/**
 * The SmallGrid is used for the two tables on the homepage. It lets you pass in data to customize the table, and have 
   highlight attributes at the top
 * @param {string} title
 * @param {object} GridAttributes - { title, blockOneTitle, blockOneValue, blockTwoTitle, blockTwoValue, component }
 */
function SmallGrid({GridAttributes}) {
    return (
        <Box sx={{ flexGrow: 1}}>
            <Typography variant="h5">{GridAttributes.title}</Typography>  
            <br />
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Item>
                        <Typography variant="body2">{GridAttributes.blockOneTitle}</Typography>
                        {GridAttributes.blockOneValue}
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>
                        <Typography variant="body2">{GridAttributes.blockTwoTitle}</Typography>
                        {GridAttributes.blockTwoValue}
                    </Item>
                </Grid>
                <Grid item xs={12}>
                        {GridAttributes.component}
                </Grid>
            </Grid>
        </Box>        
    )
}
```

Since we have used TablePagination.jsx as the reusable component for the top two parent components, the logic that drives what happens in the My Games section works a little differently. Inside the Table, we use inline logic that tells the program that IF we pass in the MyGames component in, allow the user to click the rows, and if they do click the rows, handleRowClick as seen below. When handling the row clicks, we must check what type of game we are looking at to choose which component that the dialog modal should show. If the game is a ‘confirmed’ game, then we know the user still has to submit the scores of the game, so we set the selected component to this and open the dialog. If the game is a ‘verification’ game, then we know the game stats were submitted, and we need to show the logic for verifying a game.

```javascript
const handleRowClick = (game) => {
        setSelectedGame(game)
        if (game.col1 === 'confirmed') {
            setSelectedComponent(<SubmitGameData user={user} game={game} refresh={refresh} setRefresh={setRefresh} handleClose={handleClose}/>)
            setDialogOpen(true)
        }

        if (game.col1 === 'verification') {
            setSelectedComponent(<VerifyGame user={user} game={game} refresh={refresh} setRefresh={setRefresh} handleClose={handleClose}re/>)
            setDialogOpen(true)
        }
}
```

The old version of this similar logic is shown below. It was too confusing for anyone passing by the code to understand. It looks clean, however, I personally apologize for anyone that may have had to look at this because in some cases it returns components, and then it also returns a function which returns a component and more under the hood. It was not simplified enough.

```javascript
const renderLowerCardSection = () => {
            if (type === 'pending') {
                return <WaitingForGameAcceptance />
            }

            if (type === 'confirmed') {
                return <ScoreInputComponent props={{currentCard, currentUserID, refreshToken, setRefreshToken}} />
            }

            if (type === 'verification') {
                return handleVerificationStage()
            }
 };
 ```

 Nearly every single line of code was rewritten, so for the purpose of this document, it would not be appropriate to explain every piece of logic in the application, but only a subset of changes that could be useful in seeing how it was improved.



 ## Find a Game
---

Another component that was completely redesigned was finding a game. I had to find a way to design the cards without using Google Maps so that we could make it simple, yet elegant. In doing so I made sure to implement the logic to adjust the theming of each game based on what type of game it is (1v1, 2v2, 3v3….). It looks a little crazy and fun, but this was exactly the goal to give the page a slight pop from the rest of the standard simple UI that you can find elsewhere.
![Screenshot 2024-04-22 at 9 35 07 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/f17d5c88-7f28-45e2-a4ff-51fe558c4940)
![Screenshot 2024-04-22 at 9 35 49 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/1542c679-4095-43e0-aa65-d1bc158d4f46)

This component will be compared to the original version’s code because there was a lot that was cut down in order to create better results. The first thing one can see is the cutdown in the amount of code used to create virtually the same logic. I came to the conclusion that if the game prop has the teammates already in it as an object, then we wouldn’t need to re-fetch the teammates based on the game information, we could just use the .find method on the object values and check to see if the current user is a teammate of the game. If the current user is already in the game, we know to handle Leaving the game, otherwise the user is trying to join this game. Also notice that this is an example of where I called getCurrentUserID to then use this information within the program, rather than using context as in the new version and passing it in as a single prop that can be reused.

```javascript
// NEW
export default function FindGameCard({ game, user, refresh, setRefresh }) {
    const [isUserAlreadyInsideGame, setUserAlreadyInAGame] = useState(false)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const isTeammateInGame = () => {
            let result = Object.values(game?.teammates).find((value) => value === user.id.toString())
            if (result === undefined || result === null) {
                setUserAlreadyInAGame(false)
            } else {
                setUserAlreadyInAGame(true)
            }
        }    
        isTeammateInGame()
    }, [game, user])
```

```javascript
// OLD
const FindGameCard = ({ props }) => {
    const { game, refreshToken, setRefreshToken } = props;
    const [teammatesIdArray, setTeammatesIdArray] = useState([]);
    const MAX_PLAYERS = parseInt(game.gameType) * 2
    const CURRENT_NUMBER_TEAMMATES = teammatesIdArray && teammatesIdArray.length > 0 ? teammatesIdArray.length : 0;
    const [currentUserID, setCurrentUserID] = useState([])

    useEffect(() => {
        const getArrayOfTeammates = async () => {
            try {
                const result = await axios.get('https://hoop-easy-production.up.railway.app/api/getTeammates', { params: game });        
                if (result.data && result.data[0] && result.data[0].teammates) {
                    const teammates = result.data[0].teammates;
                    const teammatesArray = Object.keys(teammates).map(key => teammates[key]);
                    setTeammatesIdArray(teammatesArray);
                } else {
                    console.error('Unexpected response structure:', result.data);
                }
            } catch (error) {
                console.error('Error fetching teammates:', error);
            }
        };
        
        
        const getCurrentUserID = async () => {
            const currentUserEmail = auth?.currentUser?.email
            if (currentUserEmail !== undefined) {
                const result = await axios.get(`https://hoop-easy-production.up.railway.app/api/getCurrentUserID?email=${currentUserEmail}`);
                setCurrentUserID(result.data)
            }
        }
                
        getArrayOfTeammates()
        getCurrentUserID()
    }, [refreshToken]);
```

The handleJoinGame and handleLeaveGame methods are almost identical, so I do not need to show them here, however, the calculation of key details that appear on the page is cleaned up tremendously as you can see below. I even use a hashMap for fast look-up times in order to get the theme to be used on each card, based on the type of game it is (1v1 = 1, 2v2 = 2, etc…). Everything in the new version is clear and concise, where the old version is slightly upsetting.

```javascript
// NEW
  const theme = useTheme()
  const colorHashMap = {
    1: theme.palette.primary.orange_200,
    2: theme.palette.primary.orange_300,
    3: theme.palette.primary.orange_400,
    4: theme.palette.primary.main,
    5: theme.palette.primary.orange_600,
  }

  let { date, time } = extractDateTime(game?.time)
  let numberOfPlayersJoined = Object.values(game.teammates).length
  let maxNumberOfPlayers = parseInt(game?.gameType * 2)
  let playersNeeded = maxNumberOfPlayers - numberOfPlayersJoined
```

```javascript
// OLD -- Makes me sad that these were both done by the same developer and do the same thing at the end (both me)...

// @input: ['2', '3']
    // @return: '{"teammate0": "1", "teammate1": "2"}'
    const createTeammateJsonFromArray = (array) => {
        const jsonArray = []
        for (let i=0; i<array.length; i++) {
            if (array[i] !== undefined) {
                const string = `"teammate${i}": "${array[i]}"`
                jsonArray.push(string)
            }
        }
        const jsonInside = jsonArray.join(', ')
        const json = '{' + jsonInside + '}'
        return json
    }
  
    const playerSlots = Array.from({ length: MAX_PLAYERS }, (_, index) => {
        const className = index < CURRENT_NUMBER_TEAMMATES ? 'taken' : 'open';        
        return <div key={index} className={className}></div>;
    });

    // We disable the player's ability to join a game if they are already a teammate of the game -- So they can leave the game instead
    const disablePlayerAbilityToJoinGame = teammatesIdArray ? teammatesIdArray.some((player) => player.toString() === currentUserID.toString()) : false;
    
    if ( CURRENT_NUMBER_TEAMMATES <= 0 ) {
        return <div style={{display: 'none'}}></div>
    }
    
    // Expecting 2024-01-28 01:40:00 which is 5:40pm in my time
    const convertedDateTime = convertToLocalTime(game.dateOfGameInUTC)
    const {latitude, longitude} = game

    // Removes the country so that it fits well in the card
    const indexOfCountry = game.address.lastIndexOf(',')
    const address = game.address.slice(0, indexOfCountry)

    const buttonStyling = {
        backgroundColor: 'var(--background-gradient-start)',
        color: 'white',
        '&:hover': {
            backgroundColor: 'var(--background-dark-orange)'
        }
    }
```



## Create a Game
---

The create a game component is arguably the most important component in the entire application. As simple as it seems, there would be no app without games! This being said, we as a team had many discussions about how we can minimize the amount of time and effort it takes for a user to complete this form. We also had to move away from the @vis.gl/react-google-maps API due to its lack of efficiency and use the react-places-autocomplete package. Its UI isn’t quite as appealing (which is always something we can change later on, but this is being discussed in production) but the usability is nearly the exact same as before.

The picture on the left shows the canva design of the very first model we had in mind for creating a game, and while I still love the dark design we had, it is the simplification in steps that is appreciated. Rather than 6 required steps (not even including the game type at this point in the design/implementation process), we now use four, and the use of the Google Places API is crucial in creating this change and simplification for the user!
![Screenshot 2024-04-22 at 9 47 09 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/2f6dc63f-26fd-404d-8481-8de09e6d136f)
![Screenshot 2024-04-22 at 9 47 32 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/5953d006-95f7-462c-b924-17266e6748a2)




### Map View
---

As I was refactoring the code for the project, I realized that there may be a way to improve the user experience in an easy way — add a map to the UI. Without the map, everything looks a little too plain, and doesn’t fully attract the user to any one place in the UI, however, by adding the map to the UI, it allows both computer users and phone users of the product to easily find a game close to them visually rather than just from the card that is shown. 

Knowing that we have already used the Dialog modal box in multiple other places, I thought it would be appropriate to make the map such that each point on it could be clicked, which would open the dialog box, with the same cards you can see in the list view of Find a Game!

As you can see below, when the user clicks the single game that exists on the map, it shows the same card from the list view! This is useful because it not only creates a more attractive experience than scrolling through (supposedly) hundreds of games to find the one you want, but also uses a feature that is familiar to the user and reusable and useful for our original goal with memory efficiency!

![Screenshot 2024-04-22 at 9 48 06 PM](https://github.com/Pmcslarrow/hoop-easy-material-ui/assets/74205136/782ad34b-bb90-47af-8222-937659998bc8)





### Deployment and Last Touches
---

The final step after changing some of the little UI decisions and theming ideas is to deploy it. The first thing that I had to do was create a Dockerfile for the application that could take in arguments of environment variables passed down from Railway so that we could have secure variables.

```docker
FROM node:18-alpine AS Production

# Set default values for environment variables
ENV NODE_ENV=production
ENV REACT_APP_APIKEY=default_value
ENV REACT_APP_APPID=default_value
ENV REACT_APP_DOMAIN=default_value
ENV REACT_APP_MEASUREMENT=default_value
ENV REACT_APP_MSI=default_value
ENV REACT_APP_PORT=default_value
ENV REACT_APP_PROJECTID=default_value
ENV REACT_APP_STORAGE=default_value
ENV REACT_APP_GOOGLE_API=default_value

WORKDIR /app/src/hoop-easy-mui

COPY package*.json ./

RUN npm install

COPY . .

# Replace default values with Railway shared variables
ARG APIKEY
ARG APPID
ARG DOMAIN
ARG MEASUREMENT
ARG MSI
ARG PORT
ARG PROJECTID
ARG STORAGE
ARG GOOGLE_API

ENV REACT_APP_APIKEY=$APIKEY
ENV REACT_APP_APPID=$APPID
ENV REACT_APP_DOMAIN=$DOMAIN
ENV REACT_APP_MEASUREMENT=$MEASUREMENT
ENV REACT_APP_MSI=$MSI
ENV REACT_APP_PORT=$PORT
ENV REACT_APP_PROJECTID=$PROJECTID
ENV REACT_APP_STORAGE=$STORAGE
ENV REACT_APP_GOOGLE_API=$GOOGLE_API

RUN npm run build

CMD ["npx", "serve", "-s", "build"]
```

While it took some playing around, I was able to figure out the correct settings to prevent any errors from ESLint seen in the application, and made sure that there were not environment variables that still existing for people to see. 

Railway is a platform that helps simplify the process of deployment, and automatically detected my Dockerfile to help spin it up. 

After successfully hosting the application through Railway, it was officially time to purchase a domain name — [hoopeasy.org](http://hoopeasy.org) !!!!

*No Longer Hosted*
