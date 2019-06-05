/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/index.css";
import ExcludedDate from "./excludedDate";
import TimeRange from "./timeRange";
import { getExcludedDates, setExcludedDates } from "../../api";

let openIndex = [];

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      excludedDates: [],
      timeRanges: []
    };
  }

  /**
   * Handler for changing a excluded date
   * @param index The index of the child
   * @param show Status that indicates whether the child want to be unfold or fold
   * @param state The new state.
   */
  handleExcludedDateChange = (index, show, state) => {
    let list = this.state.excludedDates;
    if (show) {
      openIndex = index;
    } else {
      openIndex = -1;
    }

    list[index] = state;

    this.setState({
      excludedDates: list
    });

    setExcludedDates({
      data: list
        .map(item => JSON.stringify(item))
    }).then(res => {
      console.log("updated");
    });
  };

  /**
   * Handler for updating a excluded date
   * @param index The index of the child
   * @param state The new state that the child want to update
   */
  handleExcludedDateUpdate = (state, index) => {
    let list = this.state.excludedDates;
    list[index] = state;
    this.setState({
      excludedDates: list
    });
  };

  /**
   * Handler for updating a time range.
   * @param index The index of the child
   * @param state The new state that the child want to update
   */
  handleTimeRangeUpdate = (state, index) => {
    let list = this.state.timeRanges;
    list[index] = state;
    this.setState({
      timeRanges: list
    }, () => {
      setExcludedDates({
        data: this.state.timeRanges
          .map(item => JSON.stringify(item))
      }).then(res => {
        console.log("updated");
      });
    });
  };


  componentWillUpdate(nextProps, nextState, nextContext) {

  }


  /**
   * Handler for fold/unfold a excluded date
   * @param index The index of the child
   * @param show Status that indicates whether the child want to be unfold or fold
   */
  handleTimeRangeChange = (index, show) => {
    let list = this.state.excludedDates;
    if (show) {
      list.forEach(item => {
        item.edit = false;
      });
      list[index].edit = true;
    } else {
      list[index].edit = false;
    }
    this.setState({
      excludedDates: list
    });
  };

  /**
   * Handler for deleting a excluded date
   * @param index
   */
  handleExcludedDateDelete = (index) => {
    let list = this.state.excludedDates;
    list.splice(index, index + 1);
    list.forEach((item, index) => {
      item.index = index;
    });
    this.setState({
      excludedDates: list
    });
  };

  /**
   * Handler for deleting a time range
   * @param index
   */
  handleTimeRangeDelete = (index) => {
    let list = this.state.timeRanges;
    list.splice(index, index + 1);
    list.forEach((item, index) => {
      item.index = index;
    });
    this.setState({
      timeRanges: list
    });
  };


  /**
   * Handler for adding a new excluded date
   */
  addExcludedDate = () => {

    let list = this.state.excludedDates;
    let newItem = {};
    list.push({});
    list.forEach((item, index) => {
      item.index = index;
    });
    this.setState({
      excludedDates: list
    });
  };

  /**
   * Handler for adding a new time range
   */
  addTimeRange = () => {
    let list = this.state.timeRanges;
    let newItem = {};
    list.push({});
    list.forEach((item, index) => {
      item.index = index;
    });
    this.setState({
      timeRanges: list
    });
  };

  /**
   * Fetching data once the app is mounted.
   */
  componentDidMount() {
    getExcludedDates().then(res => {
      this.setState({
        excludedDates: res.data.data.map(item => JSON.parse(item))
      });
    });
  }

  render() {
    return (
      <div>
        Time Range
        <div>
          {this.state.timeRanges.length <= 0 ?
            <div className={"config-item"}>Time range is not
              configured.</div> : this.state.timeRanges.map((item, index) => (
              <TimeRange key={index}
                         range={item}
                         onEdit={this.handleTimeRangeChange}
                         onUpdate={this.handleTimeRangeUpdate}
                         onDelete={this.handleTimeRangeDelete}
              />
            ))}

          {/*No more than 7 time ranges*/}
          {this.state.timeRanges.length >= 7 &&
          <button type={"button"} className='btn btn-gray' onClick={this.addTimeRange}>Add</button>}
        </div>
        Excluded Dates
        <div>
          {this.state.excludedDates.length <= 0 ?
            <div className={"config-item"}>There's no excluded
              dates</div> : this.state.excludedDates.map((item, index) => (
              <ExcludedDate key={index}
                            index={index}
                            opened={index === openIndex}
                            date={item}
                            onEdit={this.handleExcludedDateChange}
                            onDelete={this.handleExcludedDateDelete}
              />
            ))}
          <button type={"button"} className='btn btn-gray' onClick={this.addExcludedDate}>Add</button>
        </div>
      </div>
    );
  }
}
