import React, { Component } from 'react';
import EventInfo from '../../components/EventInfo/EventInfo';

export default class DisplayEvent extends Component {
    state = {
        title: '',
        category: '',
        location: '',
        image: '',
        dateFrom: null,
        dateTo: null,
        artists: [
            {
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
                profession: ''
            }
        ]
    };

    render() {
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
                name: 'boi',
                image: 'https://yt3.ggpht.com/a-/AN66SAx-enzte_C9I5lYbxE81YRw6KDq0QdGF-jnJA=s900-mo-c-c0xffffffff-rj-k-no'
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
                proffesion: 'Lysmann'
            }, 
            {
                name: 'Vetle Harnes', 
                proffesion: 'Skabbansvarlig'
            }, 
            {
                name: 'Knut Knudsen', 
                proffesion: 'Lydmann'
            }, 
            {
                name: 'Tony Tango', 
                proffesion: 'Luring'
            }, 
        ]

        return (
            <EventInfo
                title='Arrangement tittel'
                desc='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id sapien aliquam, dictum magna vel, accumsan felis. Vivamus ultricies, urna eget lobortis lacinia, dolor tortor accumsan nisi, et mattis quam lectus non sem. Pellentesque elementum cursus luctus. Vestibulum a odio in purus condimentum congue lacinia a risus. Phasellus porta nisl dolor, eu luctus orci dictum ut. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus velit lacus, mattis sit amet convallis ac, eleifend non nunc. Nam semper diam at mauris luctus, nec suscipit quam efficitur. Aliquam dolor nulla, facilisis at dictum vitae, interdum at augue. Nunc ut magna libero. Curabitur ac faucibus eros, eget sodales ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis dictum efficitur. In magna turpis, tristique in euismod non, sodales in justo. Etiam sed enim ut ante consequat vehicula nec eu leo. Etiam leo tellus, sagittis at sagittis aliquam, aliquam eu magna. Mauris eu suscipit tortor, non aliquam tortor. Pellentesque volutpat ornare venenatis. Nunc sollicitudin quam et felis consequat, a vulputate dolor fringilla. Donec porttitor aliquet placerat. Maecenas sodales augue quis odio condimentum placerat. Quisque vitae pulvinar velit.'
                location='Lerkendal'
                longitude='10.407165038'
                latitude='63.408165034'
                date='NÅ'
                host='Espen Kalleberg'
                ticketAmount='115'
                artists={artists}
                tickets={tickets}
                staff={staff}
            />
        );
    }
}
