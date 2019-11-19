import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { AuthenticationService } from './_services/authentication.service';
import { ApiService } from './_services/api.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Transport',
    children: [
      {name: 'Tiere'},
      {name: 'Flugzeuge'},
      {name: 'Autos'},
      {name: 'Yachten'},
      {name: 'Sonstige'}
    ]
  }, {
    name: 'Immobilien',
    children: [
      {name: 'Residenzen'},
      {name: 'Monumente'},
      {name: 'Straßen'},
    ]
  }, {
    name: 'Accessoires',
    children: [
      {name: 'Uhren'},
      {name: 'Ketten'},
      {name: 'Ringe'},
    ]
  }, {
    name: 'Sonstiges',
    children: [
      {name: 'Edelsteine'},
      {name: 'Gold'},
      {name: 'Haustiere'},
      {name: 'Untertanen'}
    ]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'BonzenShop';
  email = '';
  password = '';

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
constructor(public authenticationService: AuthenticationService, public router: Router, public apiService: ApiService){
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            document.getElementById("globalwrapper").scrollIntoView();
        });
    }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  login(){
    if(this.email != '' && this.password != ''){
      this.authenticationService.login(this.email, this.password);
      
    }
    this.email = '';
    this.password = '';
  }

  logout(){
    this.authenticationService.logout();
  }

  get loading(){
    return this.authenticationService.loading;
  }

  goToHome(){
    this.router.navigate(['/']);
  }
}
