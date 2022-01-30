export interface IAbout {
  content: {
    aboutKK: {
      heading: String
      body: String
    }
    openingTime: {
      heading: String
      body: String
    }
    lotterySupport: {
      heading: String
      body: String
    }
  }
}

export const about: IAbout = {
  content: {
    aboutKK: {
      heading: `Om Klubben`,
      body: `Kraftsportsklubben av 1967 (KK-67) er en av de eldste styrkeløftklubbene i Norge. 
          Klubben har fostret flere landslagsutøvere, norgesrekordholdere, europarekordholdere og
          verdensrekordholdere. Vi som trener på KK-67 er stolte av å være en del av et
          kjempeflott treningsmiljø for folk i alle aldre og nivå.`,
    },
    openingTime: {
      heading: `Åpningstider`,
      body: `Det er stort sett folk på trening hver dag!<br />
            Kjernetiden er mandag, onsdag og fredag mellom kl. 17:00 - 20:00.`,
    },
    lotterySupport: {
      heading: `Grasrotandelen`,
      body: `KK-67 kan motta tilskud fra grasrotandelen! Det betyr at 5% av det du betaler når du
            tipper hos <i>norsk tipping</i> går til klubben! For å få til dette må du oppgi klubbens
            organisasjonsnummer neste gang du tipper <br /><strong>996 808 378</strong>`,
    },
  },
}

export interface ILocation {
  content: {
    location: {
      heading: String
      body: String
    }
    postalAdress: {
      heading: String
      body: String
    }
  }
}

export const location: ILocation = {
  content: {
    location: {
      heading: `Hvor finner du oss`,
      body: `Vi holder til i mellomveien 5 på Buran i Trondheim i et tilfluktsrom under Voldsminde
          barnehage.
          <br />
          <br />
          For å finne inngangen til KK går du inn porten til barnehagen til motsatt ende der er det
          en hvit dør med et lite KK-67 skilt til venstre for døren. Her kan du bruke nøkkelbrikke
          for å låse deg inn.`,
    },
    postalAdress: {
      heading: `Postaddresse`,
      body: `KK-67 <br />
          Postboks 1072 <br />
          7042 TRONDHEIM <br />`,
    },
  },
}

export const comitee = {
  content: {
    members: [
      {
        title: `Styreleder`,
        name: `Jostein Fiveltun`,
        phoneNumber: `+47 450 54 336`,
        email: 'kk67.styreleder@gmail.com',
      },
      {
        title: `Nestleder`,
        name: `Damian Steinke`,
        phoneNumber: ``,
        email: '',
      },
      {
        title: `Styremedlem`,
        name: ``,
        phoneNumber: ``,
        email: '',
      },
      {
        title: `Styremedlem`,
        name: ``,
        phoneNumber: ``,
        email: '',
      },
      {
        title: `Kasserer`,
        name: ``,
        phoneNumber: ``,
        email: '',
      },
    ],
  },
}
