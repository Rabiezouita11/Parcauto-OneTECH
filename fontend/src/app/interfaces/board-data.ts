import {ListData} from "./list-data";

export interface BoardData {
  id: string,
 
  name: string,
  dateCreation: Date,
  visibility: string,
  lists?: ListData[]
}
