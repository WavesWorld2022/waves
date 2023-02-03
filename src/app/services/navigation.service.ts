import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    browserRefreshed = true;
    constructor() {}
}
