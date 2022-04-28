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

export interface IComitee {
  content: {
    members: {
      title: String
      name: String
      email: String
      phoneNumber: String
    }[]
  }
}

export const comitee: IComitee = {
  content: {
    members: [
      {
        title: `Styreleder`,
        name: `Jostein Fiveltun`,
        email: 'kk67.styreleder@gmail.com',
        phoneNumber: `+47 450 54 336`,
      },
      {
        title: `Nestleder`,
        name: `Damian Steinke`,
        email: '',
        phoneNumber: ''
      },
      {
        title: `Styremedlem`,
        name: `Frøya Gathen`,
        email: '',
        phoneNumber: ``,
      },
      {
        title: `Styremedlem`,
        name: `Sara Rehnlund`,
        email: '',
        phoneNumber: ``,
      },
      {
        title: `Kasserer`,
        name: `Knut Einar Skår`,
        email: 'kk67.kasserer@gmail.com',
        phoneNumber: ``,
      },
    ],
  },
}

export interface ITrainers {
  content: {
    about: {
      title: string
      content: string
    }
  }
}

export const trainers: ITrainers = {
  content: {
    about: {
      title: `Om klubbtrenere`,
      content: `KK-67 har flere utdannede trenere gjennom <i>Norges Stryrkeløftforbund</i>. Disse hjelper 
                andre medlemmer med treningsprogrammer og teknikk på frivillig basis. Dersom du trenger 
                hjelp med trening tar du kontakt med ansvarlig for klubbtrenere <b>Damian Steinke</b>. 
                Han fordeler utøverne med behov for oppfølging på klubbtrenere. `
    },
  }
}

export interface IVoluntaryWork {
  content: {
    heading: string
    body: string
  }
}

export const voluntaryWork: IVoluntaryWork = {
  content: {
    heading: `Dugnad på KK-67`,
    body: `KK-67 drives på frivillig basis av klubbens medlemmer, og er <i>ikke</i> et billig treningssenter. 
            Dette betyr at det er visse forpliktelser når man er medlem i klubben. Som medlem har man et ansvar 
            ovenfor andre medlemmer, og ovenfor klubben som en helhet, for å bidra til et godt treningsmiljø. 
            <br /><br />
            
            Dette betyr at man skal ta vare på klubb-kamerater og at man hjelper til på trening med avløft, sikring ol. 
            Ved klubbaktivitet, som stevner eller dugnad er det også forventet at alle som har mulighet stiller 
            opp og hjelper. I tilleg blir medlemmer i klubben satt opp på vaskeliste med 2 andre klubb-kamerater 
            1-2 ganger i året.
            `
  },
}