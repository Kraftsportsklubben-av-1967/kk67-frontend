interface NmEvent {
  name: string
  startsOn: string
  endsOn: string
  countdownAt: string
  venue: string
  venueAddress: string
  city: string
  hotel: { name: string; address: string }
  youtubeVideoId: string | null
  mp4Url: string | null
}

export const NM_EVENT: NmEvent = {
  name: 'NM i styrkeløft 2027',
  startsOn: '2027-06-19',
  endsOn: '2027-06-20',
  countdownAt: '2027-06-19T00:00:00+02:00',
  venue: 'Storsalen, Studentersamfundet',
  venueAddress: 'Elgeseter gate 1, 7030 Trondheim, Norge',
  city: 'Trondheim',
  hotel: {
    name: 'Quality Hotel Prinsen',
    address: 'Kongens gate 30, 7012 Trondheim, Norge',
  },
  youtubeVideoId: null,
  mp4Url: '/public/videos/nm-2027-promo.mp4',
}
