import React from "react";
import DateInput from "./dateInput";
import { DATE_PRESETS, MONTHS, ORDERS, PERIODS, WEEKDAYS } from "./constants";
import { formatDate } from "../../utils/date";


export default class ExcludeDate extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      startDate: {
        dynamic: false,
        date: new Date(),
        dynamicDate: {
          month: 1,
          week: 1,
          day: 1
        }
      },
      endDate: {
        dynamic: false, date: new Date(), dynamicDate: {
          month: 1,
          week: 1,
          day: 1
        }
      },
      noEnd: true, //No end in repeat
      repeat: true,
      repeatCount: -1,
      repeatInterval: 1,
      repeatPeriod: PERIODS.Year
    };
  }

  getPeriodText = () => {
    return Object.keys(PERIODS)[this.state.repeatPeriod - 1];
  };

  handleRepeatChange = (event) => {
    this.setState({ repeat: event.target.checked });
  };

  handleRepeatTypeChange = (e) => {
    this.setState({ dateType: e.target.value });
  };

  handleRepeatPeriodChange = (e) => {
    this.setState({ repeatPeriod: Number.parseInt(e.target.value) });
  };

  handleNoEndChange = (event) => {
    this.setState({ noEnd: event.target.checked });
  };

  handleIntervalChange = (e) => {
    this.setState({ repeatInterval: e.target.value });
  };

  handleCountChange = (e) => {
    if (e.target.value === "-1") {
      this.setState({ noEnd: true });
    }
    this.setState({ repeatCount: e.target.value });
  };

  handlePresetChange = (e) => {
    this.setState(DATE_PRESETS[e.target.value]);
  };


  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  };


  toggleEdit = () => {
    if (this.props.opened) {
      this.props.onEdit(this.props.index, false, this.state);
    } else {
      this.props.onEdit(this.props.index, true, this.state);
    }
  };

  deleteDate = () => {
    if (window.confirm("Are you sure to delete?")
    ) {
      this.props.onDelete(this.props.index);
    } else {

    }
  };

  /*Get a brief description of this excluded date.*/
  getBrief() {
    let words = [];
    words.push(this.state.name);
    if (this.state.repeat) {
      words.push("repeat");
      words.push("on");
      if (this.state.startDate.dynamic) {
        words.push("each");
        if (this.state.repeatPeriod > PERIODS.Week) {
          words.push(Object.keys(ORDERS)[this.state.startDate.dynamicDate.week - 1]);
        }
        words.push(Object.keys(WEEKDAYS)[this.state.startDate.dynamicDate.day - 1]);
        if (this.state.repeatPeriod > PERIODS.Month) {
          words.push("of");
          words.push(Object.keys(MONTHS)[this.state.startDate.dynamicDate.month - 1]);
        }
      } else {
        words.push(formatDate(this.state.startDate.date));
      }
      if (!this.state.noEnd) {
        words.push("till");
        if (this.state.endDate.dynamic) {
          words.push("the");
          words.push(Object.keys(ORDERS)[this.state.endDate.dynamicDate.week - 1]);
          words.push(Object.keys(WEEKDAYS)[this.state.endDate.dynamicDate.day - 1]);
          words.push("of");
          words.push(Object.keys(MONTHS)[this.state.endDate.dynamicDate.month - 1]);
        } else {
          words.push(formatDate(this.state.endDate.date));
        }
      } else {

      }

    } else {
      words.push("on");
      if (this.state.startDate.dynamic) {
        if (this.state.repeatPeriod > PERIODS.Week) {
          words.push(Object.keys(ORDERS)[this.state.startDate.dynamicDate.week - 1]);
        }
        words.push(Object.keys(WEEKDAYS)[this.state.startDate.dynamicDate.day - 1]);
        if (this.state.repeatPeriod > PERIODS.Month) {
          words.push("of");
          words.push(Object.keys(MONTHS)[this.state.startDate.dynamicDate.month - 1]);
        }
      } else {
        words.push(formatDate(this.state.startDate.date));
      }
    }

    return words.join(" ");
  }

  render() {
    const { repeat, noEnd } = this.state;
    return (
      <div className={"config-item"}>
        {this.props.opened ? <div>
            <div className={"form-row"}>
              <label className={"form-item-label"}>Name</label>
              <input placeholder={"Enter a name"} value={this.state.name}
                     className={"input input-text"}
                     style={{ width: 200 }}
                     onChange={this.handleNameChange}/>
            </div>
            <div>
              <label className={"form-item-label"}>Preset</label>
              <select className={"input input-select"}
                      onChange={this.handlePresetChange}
                      style={{ width: 300 }}
                      placeholder="select preset date"
              >
                {DATE_PRESETS.map((item, index) =>
                  <option key={index} value={index}>{item.name}</option>
                )}
              </select>
            </div>
            <div className={"form-row"}
            >
              <label className={"form-item-label"} htmlFor="checkbox-repeat">Repeat</label>
              <input id='checkbox-repeat' type='checkbox' checked={this.state.repeat} onChange={this.handleRepeatChange}>
              </input>
            </div>
            {repeat && <div className={"form-row"}>
              <label className={"form-item-label"}>Repeat Period</label>
              <input id='radio-week' name="period" type="radio"
                     checked={this.state.repeatPeriod === PERIODS.Week}
                     onChange={this.handleRepeatPeriodChange} value={PERIODS.Week}/>
              <label className={"label-inline"}>Week </label>

              <input id='radio-month' name="period" type="radio"
                     checked={this.state.repeatPeriod === PERIODS.Month}
                     onChange={this.handleRepeatPeriodChange} value={PERIODS.Month}/>
              <label className={"label-inline"}>Month</label>

              <input id='radio-year' name="period" type="radio"
                     checked={this.state.repeatPeriod === PERIODS.Year}
                     onChange={this.handleRepeatPeriodChange} value={PERIODS.Year}/>
              <label className={"label-inline"}>Year </label>
            </div>
            }

            {repeat && <div className={"form-row"}>
              <label className={"form-item-label"}>Repeat Interval</label>
              <div>Each <select className={"input input-select"} value={this.state.repeatInterval}
                                style={{ width: 70, marginRight: 10 }}
                                onChange={this.handleIntervalChange}>

                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>

              </select>
                {this.getPeriodText() + (this.state.repeatInterval > 1 ? "s" : "")}
              </div>
            </div>}
            {repeat && <div className={"form-row"}>
              <label className={"form-item-label"}>Repeat Count</label>
              <div><select className={"input input-select"} value={this.state.repeatCount}
                           style={{ width: 120, marginRight: 10 }}
                           onChange={this.handleCountChange}>
                <option value={-1}>No End</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select> {this.state.repeatCount > -1 && "Time"}{this.state.repeatCount > 1 && "s"}
              </div>
            </div>}
            {DateInput.call(this,
              {
                field: "startDate",
                name: "Start Date"
              }
            )}

            {repeat && !noEnd && DateInput.call(this,
              {
                field: "endDate",
                name: "End Date"
              })
            }

            {repeat &&
            <div className={"form-row"}>
              <label className={"form-item-label"}>No End</label>
              <input type='checkbox' checked={this.state.noEnd}
                     onChange={this.handleNoEndChange}/>
            </div>}
            <div className={"form-row"}>
              <div className={"form-item-label"}/>
              {/*<button type="button" className="btn btn-outline-primary">Save</button>*/}
              <button type="button" className={"btn btn-gray"} onClick={this.toggleEdit}>Save and Close</button>
              <button type="button" className={"btn-delete"} onClick={this.deleteDate}>Delete</button>
            </div>
          </div> :
          <div>
            <span style={{ lineHeight: "20px" }}>{this.getBrief()}</span>
            <button type="button" className={"btn btn-gray"} onClick={this.toggleEdit}>Edit</button>
            <button type="button" className={"btn btn-delete"} onClick={this.deleteDate}>X</button>
          </div>}
      </div>
    );
  }

  componentDidMount() {
    this.setState(this.props.date);
  }
}