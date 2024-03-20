import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  modalRef?: BsModalRef;
  @ViewChild('memberModal', {static: true}) memberModal!: TemplateRef<any>
  isLoading = true;

  members = [
    {
      name: 'Stefan Thie',
      image: 'assets/images/about-us/stefan.jpeg',
      text: 'Stefan is the man, the legend, the one - that made the project happen. He\'s the one pulling the strings, dealing with investors, filling the role of product-owner in the build team - harassing people who work on wave related things. While running a tight ship he aims for that 100% transparency and so far so good. Stefan is a waves and wind dinosaur, and has traveled the world to visit and enjoy the best natural surf spots known to man.',
      rates: {
        surfing: 5,
        windsurfing: 5,
        kitesurfing: 4
      },
      skills: ['vision', 'strategy',  'money', 'technical']
    },
    {
      name: 'Andreas',
      image: 'assets/images/about-us/andreas.jpeg',
      text: 'Andreas is a frequent flyer at Langenfeld but on occasion Andreas goes \'shopping\' somewhere else 😉 In May 2013, I met not only Nadine, Nelson\'s mother, in Arrifana (Pt), but also a very nice, rented BMW-driving, 33-year-old, wind-wavesurfing, German named: Andreas. He was fond of surfing and stored at various locations in Portugal, parts of his quiver. He was certainly not bad in the water, but clearly not yet advanced. We have shared beautiful waves 🙂 He asks me almost daily about the wave surf report / windsurf weather in Scheveningen and if I have surfed recently? After all, living in Wuppertal, if the predictions are favorable, then he would prefer to get into his VW camper. But he never actually did that until now. Yet he practices wave surfing every week. To be precise: on Monday nights at 19:00 .... in Langefeld, on a standing wave. Characterwise, Andreas could be an Aussie: open, honest, curious and positive. I am not surprised that he, now also a father, together with his young family, still has the ambition to emigrate to Australia. Unfortunately, with residence permits today it’s no longer that simple. In October 2018, just before the birth of Victoria, his first child, he went on a solo surf-campertrip of 6 weeks to the Goldcoast. And although he still lacked a bit of paddle condition / golf insight, he had become almost indistinguishable from an expert on the wave. The spray of his turns was so spectacular that the locals cheered and made him compliments. They had not often seen a 39-year-old German who was able to surf so well 🙂 And when I see him surf, neither do I! Except maybe for that German teenager I met, who lived in Pavones (CR) and had received private education all his life around the best tides for surfing ‘the second longest left in the world’. Since our first meeting, Andreas has booked the standing wave at Langefeld for an hour with 7 other \'riders against the machine\' ... on Monday evenings ... 20 times (a 34 euros) ...',
      rates: {
        surfing: 5,
        windsurfing: 4,
      },
      skills: ['consulting', 'content'],
      social: 'https://www.facebook.com/rideagainstthemachine/'
    },
  ]
  activeMember: any;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onShowMore(member: any) {
    this.activeMember = member;
    this.modalRef = this.modalService.show(this.memberModal, {class: 'modal-md modal-dialog-centered'});
  }

  closeModal() {
    this.activeMember = null;
    this.modalRef?.hide();
  }

}
