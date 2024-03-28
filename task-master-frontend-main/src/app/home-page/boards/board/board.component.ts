import {Component, OnInit} from '@angular/core';
import {BoardData} from "../../../interfaces/board-data";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: BoardData = {
    dateCreation: new Date('2023-08-05'), id: "", name: "Product Roadmap", visibility: "Public", lists: [
      {
        name: "toDo",
        cards: [
          {
            name: "Card-one",
            activity: "Lorem ipsum dolor sit amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc augue eros, congue a nunc non, feugiat mollis ipsum. In ullamcorper dui at sodales luctus. Mauris venenatis, dolor vitae tincidunt molestie, urna magna lobortis nisi, eu rutrum ipsum erat in dolor",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-two",
            activity: "Sed eu lacus eu nisi lacinia",
            description: "Integer consequat, quam ac tincidunt blandit, justo risus condimentum leo, quis condimentum mi velit at metus. Proin sodales scelerisque mauris, nec dapibus felis malesuada a. Mauris at scelerisque augue, et maximus nisi",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-three",
            activity: "Donec sit amet justo et diam",
            description: "Vestibulum pretium porta sapien at varius. Proin porta urna ut risus commodo egestas. Nullam non orci lacinia, efficitur purus a, pharetra quam",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-four",
            activity: "Nullam id arcu a metus varius",
            description: "Sed vestibulum interdum consectetur. Praesent congue augue a sem accumsan consectetur. Quisque iaculis dui justo. Suspendisse fringilla varius tortor ut placerat",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-five",
            activity: "Praesent dictum tortor sed enim",
            description: "Donec sagittis enim neque, et fermentum nibh vehicula sit amet. Proin libero erat, accumsan a justo a, fringilla consequat lacus. Pellentesque luctus fringilla arcu ut mattis",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-six",
            activity: "Donec bibendum lorem ac ipsum",
            description: "Quisque at justo tincidunt, molestie nibh a, hendrerit velit. Proin at sollicitudin nibh, a vulputate sem. Nulla vel eleifend mi, quis scelerisque tortor. Aliquam odio nibh, gravida at aliquet sit amet, rhoncus non velit. Curabitur",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-seven",
            activity: "Morbi sed elit in erat semper vehicula",
            description: "Quis risus ultricies, semper risus sit amet, eleifend dui. Morbi venenatis tellus nec aliquet tristique. Aenean enim quam, ullamcorper nec porttitor quis, euismod ornare tellus. Integer consequat porttitor augue, sodales venenatis",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          }
        ]
      },
      {
        name: "Doing",
        cards: [
          {
            name: "Card-one",
            activity: "Lorem ipsum dolor sit amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc augue eros, congue a nunc non, feugiat mollis ipsum. In ullamcorper dui at sodales luctus. Mauris venenatis, dolor vitae tincidunt molestie, urna magna lobortis nisi, eu rutrum ipsum erat in dolor",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-two",
            activity: "Sed eu lacus eu nisi lacinia",
            description: "Integer consequat, quam ac tincidunt blandit, justo risus condimentum leo, quis condimentum mi velit at metus. Proin sodales scelerisque mauris, nec dapibus felis malesuada a. Mauris at scelerisque augue, et maximus nisi",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-three",
            activity: "Donec sit amet justo et diam",
            description: "Vestibulum pretium porta sapien at varius. Proin porta urna ut risus commodo egestas. Nullam non orci lacinia, efficitur purus a, pharetra quam",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-four",
            activity: "Nullam id arcu a metus varius",
            description: "Sed vestibulum interdum consectetur. Praesent congue augue a sem accumsan consectetur. Quisque iaculis dui justo. Suspendisse fringilla varius tortor ut placerat",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-five",
            activity: "Praesent dictum tortor sed enim",
            description: "Donec sagittis enim neque, et fermentum nibh vehicula sit amet. Proin libero erat, accumsan a justo a, fringilla consequat lacus. Pellentesque luctus fringilla arcu ut mattis",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          }
        ]
      },
      {
        name: "Done",
        cards: [
          {
            name: "Card-one",
            activity: "Lorem ipsum dolor sit amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc augue eros, congue a nunc non, feugiat mollis ipsum. In ullamcorper dui at sodales luctus. Mauris venenatis, dolor vitae tincidunt molestie, urna magna lobortis nisi, eu rutrum ipsum erat in dolor",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-two",
            activity: "Sed eu lacus eu nisi lacinia",
            description: "Integer consequat, quam ac tincidunt blandit, justo risus condimentum leo, quis condimentum mi velit at metus. Proin sodales scelerisque mauris, nec dapibus felis malesuada a. Mauris at scelerisque augue, et maximus nisi",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-three",
            activity: "Donec sit amet justo et diam",
            description: "Vestibulum pretium porta sapien at varius. Proin porta urna ut risus commodo egestas. Nullam non orci lacinia, efficitur purus a, pharetra quam",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          }
        ]
      },
      {
        name: "Delayed",
        cards: [
          {
            name: "Card-one",
            activity: "Lorem ipsum dolor sit amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc augue eros, congue a nunc non, feugiat mollis ipsum. In ullamcorper dui at sodales luctus. Mauris venenatis, dolor vitae tincidunt molestie, urna magna lobortis nisi, eu rutrum ipsum erat in dolor",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-two",
            activity: "Sed eu lacus eu nisi lacinia",
            description: "Integer consequat, quam ac tincidunt blandit, justo risus condimentum leo, quis condimentum mi velit at metus. Proin sodales scelerisque mauris, nec dapibus felis malesuada a. Mauris at scelerisque augue, et maximus nisi",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-three",
            activity: "Donec sit amet justo et diam",
            description: "Vestibulum pretium porta sapien at varius. Proin porta urna ut risus commodo egestas. Nullam non orci lacinia, efficitur purus a, pharetra quam",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-four",
            activity: "Nullam id arcu a metus varius",
            description: "Sed vestibulum interdum consectetur. Praesent congue augue a sem accumsan consectetur. Quisque iaculis dui justo. Suspendisse fringilla varius tortor ut placerat",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-five",
            activity: "Praesent dictum tortor sed enim",
            description: "Donec sagittis enim neque, et fermentum nibh vehicula sit amet. Proin libero erat, accumsan a justo a, fringilla consequat lacus. Pellentesque luctus fringilla arcu ut mattis",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-six",
            activity: "Donec bibendum lorem ac ipsum",
            description: "Quisque at justo tincidunt, molestie nibh a, hendrerit velit. Proin at sollicitudin nibh, a vulputate sem. Nulla vel eleifend mi, quis scelerisque tortor. Aliquam odio nibh, gravida at aliquet sit amet, rhoncus non velit. Curabitur",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          }
        ]
      },
      {
        name: "Discarded",
        cards: [
          {
            name: "Card-one",
            activity: "Lorem ipsum dolor sit amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc augue eros, congue a nunc non, feugiat mollis ipsum. In ullamcorper dui at sodales luctus. Mauris venenatis, dolor vitae tincidunt molestie, urna magna lobortis nisi, eu rutrum ipsum erat in dolor",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-two",
            activity: "Sed eu lacus eu nisi lacinia",
            description: "Integer consequat, quam ac tincidunt blandit, justo risus condimentum leo, quis condimentum mi velit at metus. Proin sodales scelerisque mauris, nec dapibus felis malesuada a. Mauris at scelerisque augue, et maximus nisi",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-three",
            activity: "Donec sit amet justo et diam",
            description: "Vestibulum pretium porta sapien at varius. Proin porta urna ut risus commodo egestas. Nullam non orci lacinia, efficitur purus a, pharetra quam",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-four",
            activity: "Nullam id arcu a metus varius",
            description: "Sed vestibulum interdum consectetur. Praesent congue augue a sem accumsan consectetur. Quisque iaculis dui justo. Suspendisse fringilla varius tortor ut placerat",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-five",
            activity: "Praesent dictum tortor sed enim",
            description: "Donec sagittis enim neque, et fermentum nibh vehicula sit amet. Proin libero erat, accumsan a justo a, fringilla consequat lacus. Pellentesque luctus fringilla arcu ut mattis",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-six",
            activity: "Donec bibendum lorem ac ipsum",
            description: "Quisque at justo tincidunt, molestie nibh a, hendrerit velit. Proin at sollicitudin nibh, a vulputate sem. Nulla vel eleifend mi, quis scelerisque tortor. Aliquam odio nibh, gravida at aliquet sit amet, rhoncus non velit. Curabitur",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          },
          {
            name: "Card-seven",
            activity: "Morbi sed elit in erat semper vehicula",
            description: "Quis risus ultricies, semper risus sit amet, eleifend dui. Morbi venenatis tellus nec aliquet tristique. Aenean enim quam, ullamcorper nec porttitor quis, euismod ornare tellus. Integer consequat porttitor augue, sodales venenatis",
            startDate: new Date('2023-08-05'),
            endDate: new Date('2023-08-05')
          }
        ]
      }
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
  }


}
