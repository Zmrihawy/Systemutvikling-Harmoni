import React, { Component } from 'react';
import EventInfo from '../../components/EventInfo/EventInfo';
import {Event, Ticket, Crew, Performance, User, eventService, userService} from '../../services';
import { faCommentDollar } from '@fortawesome/free-solid-svg-icons';

export default class DisplayEvent extends Component {
    state = {
        id: null,
        title: '',
        category: '',
        location: '',
        ticketAmount: null,
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

    async componentDidMount() {
        //TODO eventid
        let eventId = 1;
            eventService
            .getEvent(eventId)
            .then(recivedEvent => {
                this.setState({title: recivedEvent.name, location: recivedEvent.location, dateFrom: new Date(recivedEvent.startTime).toUTCString().slice(0,-7), dateTo: new Date(recivedEvent.endTime).toUTCString().slice(0,-7)})
            }).catch((error:Error) => console.log('Error event')); 
    
        eventService
        .getEventTickets(eventId)
        .then(ticket_array => {
            this.setState({tickets : ticket_array.map(ticketConvert)});
            let ticketCount = ticketcounter(ticket_array);
            this.setState({ticketAmount: ticketCount})
        }).catch((error : Error) => console.error(error));

        function ticketcounter(tickets) {
            let ticketCount = 0; 
            tickets.map(ticket => ticketCount += ticket.amount); 
            return ticketCount; 
        }
        
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

           eventService
           .getCrew(eventId)
           .then(staff_array => {
               this.setState({staff : staff_array.map(staffConvert)});
           }).catch((error : Error) => console.log('error staff'));
   
    }

    render() {

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
                dateFrom={this.state.dateFrom}
                dateTo= {this.state.dateTo}
                host='Espen Kalleberg'
                ticketAmount={this.state.ticketAmount}
                artists={artists}
                tickets={tickets}
                staff={staff}
            />
        );
    }
}

