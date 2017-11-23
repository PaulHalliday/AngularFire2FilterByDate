import { Component } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { switchMap, toArray } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';

class Lesson {
  date: any;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  lesson = new Lesson();
  lessonsRef: AngularFireList<Lesson>;
  lessons$: Observable<Lesson[]>;

  constructor(private af: AngularFireDatabase) {
    this.lessonsRef = af.list('lessons');

    this.lessons$ = this.lessonsRef
      .snapshotChanges(['child_added'])
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val(),
        }));
      })
      .map(lessons => {
        return lessons.sort((a: Lesson, b: Lesson) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
        });
      });
  }

  addLesson() {
    this.af.list<Lesson>('lessons').push({
      date: firebase.database.ServerValue.TIMESTAMP,
      name: this.lesson.name,
    });
  }
}
