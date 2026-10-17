interface NmEvent {
  name: string
  startsOn: string
  endsOn: string
  venue: string
  city: string
  youtubeVideoId: string | null
}

export const NM_EVENT: NmEvent = {
  name: 'NM i styrkeløft 2027',
  startsOn: '2027-06-19',
  endsOn: '2027-06-20',
  venue: 'Storsalen, Studentersamfundet',
  city: 'Trondheim',
  youtubeVideoId: null,
}
