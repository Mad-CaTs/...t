export interface ILanguageFile {
	header: Header;
	footer: Footer;
	home: Home;
	products: Products;
	productDetail: ProductDetail;
	oportunity: Unity;
	comunity: Unity;
	news: News;
	newsDetail: NewsDetail;
	calendar: Calendar;
	eventPage: EventPage;
	eventsDetail: EventsDetail;
	events: Event[];
}

interface Calendar {
	title: string;
	subtitle: string;
	filters: Filters;
}

interface Filters {
	searchLabel: string;
	searchPlaceholder: string;
	options: string[];
}

interface Unity {
	title: string;
	description: string;
	sections: Section[];
	inspiration?: Inspiration;
	testimonials?: Testimonials;
}

interface Inspiration {
	title: string;
	subtitle: string;
	testimonials: Testimonial[];
}

interface Testimonial {
	text: string;
	name: string;
	since: string;
}

interface Section {
	pre: string;
	title: string;
	content: string;
}

interface Testimonials {
	pre: string;
	title: string;
	items: Testimonial[];
}

interface EventPage {
	upcommingEventsTitle: string;
	upcomingEvents: Ent[];
	pastEventsTitle: string;
	pastEvents: Ent[];
	trendsTitle: string;
}

interface Ent {
	date: string;
	title: string;
}

interface Event {
	title: string;
	date: string;
	type: string;
	duration: string;
	positiveReviews: string;
	summary: string;
	learn: string[];
}

interface EventsDetail {
	backLabel: string;
	resumeTitle: string;
	learnTitle: string;
}

interface Footer {
	contactInformation: ContactInformation;
	sections: string[];
}

interface ContactInformation {
	phone: string;
	email: string;
}

interface Header {
	menuItems: MenuItem[];
	languageTitle: string;
	languageInputPlaceholder: string;
	languageInputLabel: string;
	languages: string[];
	slogan: string;
}

interface MenuItem {
	label: string;
	subItems?: SubItem[];
}

interface SubItem {
	label: string;
}

interface Home {
	carousel: Carousel;
	keola: Keola;
	lastUpdates: LastUpdates;
	howWorks: HowWorks;
	cards: LastUpdates[];
	testimonialsSection: TestimonialsSection;
}

interface LastUpdates {
	title: string;
	description: string;
	button: string;
}

interface Carousel {
	carouselEntry: string;
	carouselTitle: string;
	carouselText: string;
	carouselBtn1: string;
	carouselBtn2: string;
}

interface HowWorks {
	title: string;
	subtitle: string;
	steps: Step[];
}

interface Step {
	title: string;
	description: string;
}

interface Keola {
	cta: string;
	btn: string;
	titles: string[];
}

interface TestimonialsSection {
	cardPrefix: string;
	heading: string;
	button: string;
	testimonials: Testimonial[];
}

interface News {
	titleMain: string;
	descriptionMain: string;
	commonEventsCountry: string;
	commonEventsBtn: string;
	noticeLabel: string;
	content: NewsDetail[];
}

export interface NewsDetail {
	date?: string;
	title: string;
	description?: string;
	content?: Ent[];
}

interface ProductDetail {
	aboutUsTitle: string;
	aboutBtnText: string;
	products: Product[];
}

interface Product {
	aboutTitle: string;
	aboutDescription: string;
	perkPreTitle: string;
	perktitle: string;
	perkDescription: string;
	cards: Step[];
}

interface Products {
	navigation: string[];
	items: NextProjects[];
	nextProjects: NextProjects;
}

interface NextProjects {
	title: string;
	description: string;
	buttonText: string;
}
