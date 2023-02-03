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
      name: 'Rinse',
      image: 'assets/images/about-us/rinse.jpeg',
      text: 'Rinse breathes wind and water, if there\'s a new toy to play with those (no not like that you pervert) Rinse is on it. As a result a massive amount of toys is piling out of his garage. Rinse is a general consultant and part of the building team. Rinse also has a particular good view on ways to monetize waves.guide.',
      rates: {
        surfing: 5,
        windsurfing: 5,
        kitesurfing: 5
      },
      skills: ['marketing', 'creative', 'consulting']
    },
    {
      name: 'Felix',
      image: 'assets/images/about-us/felix.jpeg',
      text: 'Felix was born on a windsurfboard but has come to appreciate wavesurfing as well in the last couple of years. And although he denies it - his mission in life is all about getting his kids to step on a board and stay there, forever. Not a week goes by without us receiving a picture from Felix of one of his kids; power jibing, bodyboarding or skimboarding. That ambition has consequences: He managed to be (a little bit) too late for every photo-shoot we have had so far. It could also be that he was playing with his new TAKA windsurfsails or one of his new surfboards himself ',
      rates: {
        surfing: 5,
        windsurfing: 5,
        kitesurfing: 5
      },
      skills: ['consulting', 'reviewer']
    },
    {
      name: 'Bas',
      image: 'assets/images/about-us/bas.jpeg',
      text: 'Bas was born on a surfboard and will always be found in a sauna after each surfsession. When Bas heard about waves.guide, he was \'all ear\' 😉 Seriously: Bas his life has been hanging by a thread caused by a severe inner-ear infection and from that moment on, Bas builds his own wave surfboards, he prefers minimalism and therefore pure nature surfing. That is why our project is showing you where the closest \'natural surfspot\' is from an artificial wave.',
      rates: {
        surfing: 5,
        windsurfing: 5,
      },
      skills: ['consulting']
    },
    {
      name: 'Tobias',
      image: 'assets/images/about-us/tobias.jpeg',
      text: 'When Stefan came to me and told me he was toying with the idea to create a website about man-made-waves, I told him that if he really wanted to do that, he should go for it, immediately, no waiting any longer - start asap, and not to do it half-assed, but tdo it properly right-away! A little over a week later he called me and asked if I wanted to join him on this adventure, and pick up the development part. I asked him: "when do you want to start?" to which he replied: "rightaway...". This made me smirke a bit, he politely added: \'well, you told me to start asap\'. It was impossible to refuse.',
      rates: {
        windsurfing: 4,
        forward_loop: 0,
        snorkeling: 4
      },
      skills: ['concept', 'creative', 'development']
    },
    {
      name: 'Andreas',
      image: 'assets/images/about-us/andreas.jpeg',
      text: 'Andreas is a frequent flyer at Langenfeld but on occasion Andreas goes \'shopping\' somewhere else 😉 In May 2013, I met not only Nadine, Nelson\'s mother, in Arrifana (Pt), but also a very nice, rented BMW-driving, 33-year-old, wind-wavesurfing, German named: Andreas. He was fond of surfing and stored at various locations in Portugal, parts of his quiver. He was certainly not bad in the water, but clearly not yet advanced. We have shared beautiful waves 🙂 He asks me almost daily about the wave surf report / windsurf weather in Scheveningen and if I have surfed recently? After all, living in Wuppertal, if the predictions are favorable, then he would prefer to get into his VW camper. But he never actually did that until now. Yet he practices wave surfing every week. To be precise: on Monday nights at 19:00 .... in Langefeld, on a standing wave. Characterwise, Andreas could be an Aussie: open, honest, curious and positive. I am not surprised that he, now also a father, together with his young family, still has the ambition to emigrate to Australia. Unfortunately, with residence permits today it’s no longer that simple. In October 2018, just before the birth of Victoria, his first child, he went on a solo surf-campertrip of 6 weeks to the Goldcoast. And although he still lacked a bit of paddle condition / golf insight, he had become almost indistinguishable from an expert on the wave. The spray of his turns was so spectacular that the locals cheered and made him compliments. They had not often seen a 39-year-old German who was able to surf so well 🙂 And when I see him surf, neither do I! Except maybe for that German teenager I met, who lived in Pavones (CR) and had received private education all his life around the best tides for surfing ‘the second longest left in the world’. Since our first meeting, Andreas has booked the standing wave at Langefeld for an hour with 7 other \'riders against the machine\' ... on Monday evenings ... 20 times (a 34 euros) ...',
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
