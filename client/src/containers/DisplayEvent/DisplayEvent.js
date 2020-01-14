import React, { Component } from 'react';
import EventInfo from '../../components/EventInfo/EventInfo';
import {Event, Ticket, Crew, Performance, User, eventService, userService} from '../../services';

export default class DisplayEvent extends Component {
    state = {
        id: null,
        title: '',
        category: '',
        location: '',
        image: '',
        dateFrom: null,
        dateTo: null,
        artists: [
            {
                id: '',
                name: '',
                riders: ['']
            }
        ],
        tickets: [
            {
                description: '',
                amount: null,
                price: null
            }
        ],
        staff: [
            {
                name: '',
                profession: '',
                number: ''
            }
        ]
    };


    render() {

        let eventId = 1;
        let service_event = eventService.getEvent(eventId);


          let artists = [
            {
                name: 'Steven Kvinlaug',
                image: 'https://www.kvinesdal24.no/images/4817c829-a1f7-45b7-90cf-f3cbd4a64109?fit=crop&q=80&w=580'
            },
            {
                name: 'Torje Thorkildsen',
                image: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/11745966_900217626718522_810341310080559599_n.jpg?_nc_cat=104&_nc_ohc=43mIm-b8EL4AQkdvkWV2NG2ICSHhTl1jD40ytTi-0VN5UbCq6TY7nF-uQ&_nc_ht=scontent-arn2-1.xx&oh=1584203c5b173c3f55c7eeb033e331e8&oe=5E93BB8F'
            }
        ];


        let serv_tickets = eventService.getEventTickets(eventId);

        let tickets;

        function ticketConvert(ticket) {
            return ({
                description: ticket.name,
                amount: ticket.amount,
                price: ticket.price

            })
          };


        const getTickets = (serv_tickets) => {
            Promise.all(tickets.map(ticketConvert))
           }


        let serv_staff = eventService.getCrew(eventId);
        let staff;

        function staffConvert(staff) {
            return ({
                name: staff.name,
                profession: staff.profession,
                number: staff.contactInfo

            })
          };


        const getStaff = (serv_staff) => {
            Promise.all(staff.map(staffConvert))
           }
  
        return (
            <EventInfo
                title= {service_event.name}
                desc='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id sapien aliquam, dictum magna vel, accumsan felis. Vivamus ultricies, urna eget lobortis lacinia, dolor tortor accumsan nisi, et mattis quam lectus non sem. Pellentesque elementum cursus luctus. Vestibulum a odio in purus condimentum congue lacinia a risus. Phasellus porta nisl dolor, eu luctus orci dictum ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus velit lacus, mattis sit amet convallis ac, eleifend non nunc. Nam semper diam at mauris luctus, nec suscipit quam efficitur. Aliquam dolor nulla, facilisis at dictum vitae, interdum at augue. Nunc ut magna libero. Curabitur ac faucibus eros, eget sodales ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis dictum efficitur. In magna turpis, tristique in euismod non, sodales in justo. Etiam sed enim ut ante consequat vehicula nec eu leo. Etiam leo tellus, sagittis at sagittis aliquam, aliquam eu magna. Mauris eu suscipit tortor, non aliquam tortor. Pellentesque volutpat ornare venenatis. Nunc sollicitudin quam et felis consequat, a vulputate dolor fringilla. Donec porttitor aliquet placerat. Maecenas sodales augue quis odio condimentum placerat. Quisque vitae pulvinar velit.'
                location={service_event.location}
                longitude='10.421906'
                latitude='63.446827'
                date={service_event.startTime}
                host='Espen Kalleberg'
                ticketAmount='115'
                artists={artists}
                tickets={tickets}
                staff={staff}
            />
        );
    }
}


/*

  let artists = [
            {
                name: 'Steven Kvinlaug',
                image: 'https://www.kvinesdal24.no/images/4817c829-a1f7-45b7-90cf-f3cbd4a64109?fit=crop&q=80&w=580'
            },
            {
                name: 'Mathias Heggelund',
                image: 'https://no.regionstavanger-ryfylke.com/imageresizer/?image=%2Fdmsimgs%2FSteven_juli_1570436376.jpg&action=ProductDetail'
            },
            {
                name: 'Kjell Elvis',
                image: 'https://smp.vgc.no/v2/images/399add63-f2cb-4e51-bb5d-c6a7fadd648a?fit=crop&h=280&w=430&s=c1879b80b1bee1d859ed1264b5ed532e89123ad2'
            },
            {
                name: 'Dev Høie',
                image: 'https://www.cdn.tv2.no/images?imageId=8777968&width=647&height=272&compression=80'
            },
            {
                name: 'boi',
                image: 'https://yt3.ggpht.com/a-/AN66SAx-enzte_C9I5lYbxE81YRw6KDq0QdGF-jnJA=s900-mo-c-c0xffffffff-rj-k-no'
            }, 
            {
                name: 'Torje Thorkildsen',
                image: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/11745966_900217626718522_810341310080559599_n.jpg?_nc_cat=104&_nc_ohc=43mIm-b8EL4AQkdvkWV2NG2ICSHhTl1jD40ytTi-0VN5UbCq6TY7nF-uQ&_nc_ht=scontent-arn2-1.xx&oh=1584203c5b173c3f55c7eeb033e331e8&oe=5E93BB8F'
            }
        ];

        let tickets = [
            {
                description: 'Early Bird',
                amount: 50,
                price: 450
            },
            {
                description: 'Late Bird',
                amount: 50,
                price: 300
            },
            {
                description: 'Skækk Bird',
                amount: 1,
                price: 1000
            },
            {
                description: 'Fæ Bird',
                amount: 50,
                price: 90
            },
            {
                description: 'Boi Bird',
                amount: 20,
                price: 110
            },
            {
                description: 'Bulke Bird',
                amount: 150,
                price: 850
            }
        ];

        let staff = [
            {
                name: 'Sandnes Lys & Leven AS', 
                proffesion: 'Lysmann',
                number: '99933345'
            }, 
            {
                name: 'Vetle Harnes', 
                proffesion: 'Skabbansvarlig',
                number: '32937444'
            }, 
            {
                name: 'Knut Knudsen', 
                proffesion: 'Lydmann',
                number: '42069999'
            }, 
            {
                name: 'Tony Tango', 
                proffesion: 'Luring',
                number: '12345566'
            }, 
        ]
*/