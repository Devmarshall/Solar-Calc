import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/js/bootstrap'
import '../node_modules/popper.js/dist/popper';
import '../node_modules/jquery/dist/jquery'

class App extends Component {

  initiaState = {
    directEnergyRequirementInputValue: 1,
    energyRequirementMethod: 0,
    TotalEnergyRequirement: 0,
    Loads_AC: [],
    Loads_DC: [],
    incompleteFieldError_step1_method_1: false,
    inverterEfficiency: 50,
    tsrf: 50,
    pvArrayEffeciency: 50,
    batteryEffeciency: 50,
    peakSunHours: 1,
    daysOfAutonomy: 1,
    tempCompensation: 50,
    depthOfDischarge: 50,
    nominalVoltage: 12,
    prescenceOfInductiveLoads: false,
    BatteryCapacity: 0,
    TotalSystemCapacity: 0,
    InverterRating: 0,
    PVArrayRating: 0,
    newItem: {
      name: "",
      wattage: 1,
      dailyUsage: 1,
      weeklyUsage: 1,
      type: "AC"
    }

    // step_1_method options
    // 0: No method Selected
    // 1: Direct Load Input
    // 2: Individual Capacity Input
  }

  newItemFormValues_initial = {
    name: "",
    wattage: 0,
    dailyUsage: 0,
    weeklyUsage: 0,
    type: "AC"
  }
  directCapacityInput_value_initial = 0;

  newItemFormValues = this.newItemFormValues_initial;
  directCapacityInput_value = this.directCapacityInput_value_initial;

  constructor(props) {
    super(props);
    this.state = this.initiaState;

    this.create_NewItem = this.create_NewItem.bind(this);
    this.onChange_NewItem_name = this.onChange_NewItem_name.bind(this);
    this.onChange_NewItem_wattage = this.onChange_NewItem_wattage.bind(this)
    this.onChange_NewItem_dailyUsage = this.onChange_NewItem_dailyUsage.bind(this);
    this.onChange_NewItem_weeklyUsage = this.onChange_NewItem_weeklyUsage.bind(this);
    this.onChange_NewItem_type = this.onChange_NewItem_type.bind(this);

    this.onChange_inverterEffeciency = this.onChange_inverterEffeciency.bind(this);
    this.onChange_DirectInput_value = this.onChange_DirectInput_value.bind(this);

    this.onChange_batteryEffeciency = this.onChange_batteryEffeciency.bind(this);
    this.onChange_pvArrayEffeciency = this.onChange_pvArrayEffeciency.bind(this);
    this.onChange_TSRF = this.onChange_TSRF.bind(this);
    this.onChange_PeakSunHours = this.onChange_PeakSunHours.bind(this);
    this.onChange_DaysOfAutonomy = this.onChange_DaysOfAutonomy.bind(this);
    this.onChange_TempCompensation = this.onChange_TempCompensation.bind(this);
    this.onChange_DepthOfDischarge = this.onChange_DepthOfDischarge.bind(this);
    this.onChange_NominalVoltage = this.onChange_NominalVoltage.bind(this);
    this.onChange_PresenceOfInductiveLoads = this.onChange_PresenceOfInductiveLoads.bind(this);

    this.compute_TotalEnergyRequirement = this.compute_TotalEnergyRequirement.bind(this);
    this.compute_BatteryCapacity = this.compute_BatteryCapacity.bind(this);
    this.compute_TotalSystemCapacity = this.compute_TotalSystemCapacity.bind(this);
    this.compute_PVArrayRating = this.compute_PVArrayRating.bind(this);
    this.compute_InverterRating = this.compute_InverterRating.bind(this);
  }

  compute_TotalEnergyRequirement() {
    let result;
    let totalDCPowerReq = 0;
    let totalACPowerReq = 0;
    switch (this.state.energyRequirementMethod) {
      case 0:
        result = 0
        break;
      case 1:
        result = this.state.directEnergyRequirementInputValue / (this.state.inverterEfficiency / 100)
        break;

      case 2:
        this.state.Loads_AC.forEach(item => {
          totalACPowerReq += (item.wattage * item.dailyUsage * item.weeklyUsage / 7)
        });
        this.state.Loads_DC.forEach(item => {
          totalDCPowerReq += (item.wattage * item.dailyUsage * item.weeklyUsage / 7)
        })
        totalACPowerReq = totalACPowerReq / (this.state.inverterEfficiency / 100)
        result = totalACPowerReq + totalDCPowerReq;
        break;

      default:
        break;
    }
    this.setState({ TotalEnergyRequirement: result })
  }

  compute_PVArrayRating() {
    let result = this.state.TotalEnergyRequirement / ((this.state.batteryEffeciency / 100) * (this.state.pvArrayEffeciency / 100) * (this.state.tsrf / 100) * (this.state.peakSunHours))
    this.setState({ PVArrayRating: result })
  }

  compute_BatteryCapacity() {
    let result = (this.state.TotalEnergyRequirement * this.state.daysOfAutonomy) / ((this.state.inverterEfficiency / 100) * (this.state.tempCompensation / 100) * (this.state.depthOfDischarge / 100) * (this.state.nominalVoltage))
    this.setState({ BatteryCapacity: result });
  }

  compute_InverterRating() {
    let result;
    if (this.state.prescenceOfInductiveLoads == "true") {
      result = this.state.TotalEnergyRequirement * this.state.daysOfAutonomy * 3
    } else {
      result = this.state.TotalEnergyRequirement * this.state.daysOfAutonomy * 1.3
    }
    this.setState({ InverterRating: result });
  }

  compute_TotalSystemCapacity() {
    let result = this.state.TotalEnergyRequirement * this.state.daysOfAutonomy;
    this.setState({ TotalSystemCapacity: result });
  }

  onChange_inverterEffeciency(event) {
    this.setState({ inverterEfficiency: event.target.value })
  }

  onChange_DirectInput_value(event) {
    this.setState({ directEnergyRequirementInputValue: event.target.value })
  }

  onChange_NewItem_name(event) {
    let newItem = this.state.newItem
    newItem.name = event.target.value
    this.setState({ newItem: newItem })
  }
  onChange_NewItem_wattage(event) {
    let newItem = this.state.newItem
    newItem.wattage = event.target.value
    this.setState({ newItem: newItem })
  }

  onChange_NewItem_dailyUsage(event) {
    let newItem = this.state.newItem
    newItem.dailyUsage = event.target.value
    this.setState({ newItem: newItem })
  }

  onChange_NewItem_weeklyUsage(event) {
    let newItem = this.state.newItem
    newItem.weeklyUsage = event.target.value
    this.setState({ newItem: newItem })
  }

  onChange_NewItem_type(event) {
    let newItem = this.state.newItem
    newItem.type = event.target.value
    this.setState({ newItem: newItem })
  }

  onChange_batteryEffeciency(event) {
    this.setState({ batteryEffeciency: event.target.value })
  }
  onChange_pvArrayEffeciency(event) {
    this.setState({ pvArrayEffeciency: event.target.value })
  }
  onChange_TSRF(event) {
    this.setState({ tsrf: event.target.value })
  }
  onChange_PeakSunHours(event) {
    this.setState({ peakSunHours: event.target.value })
  }

  onChange_DaysOfAutonomy(event) {
    this.setState({ daysOfAutonomy: event.target.value })
  }

  onChange_TempCompensation(event) {
    this.setState({ tempCompensation: event.target.value })
  }

  onChange_DepthOfDischarge(event) {
    this.setState({ depthOfDischarge: event.target.value })
  }

  onChange_NominalVoltage(event) {
    this.setState({ nominalVoltage: event.target.value })
  }

  onChange_PresenceOfInductiveLoads(event) {
    this.setState({ prescenceOfInductiveLoads: event.target.value })
  }

  create_NewItem() {
    const newItem = JSON.parse(JSON.stringify(this.state.newItem))
    if (newItem.type === "AC") {
      this.state.Loads_AC.push(newItem);
    } else if (newItem.type === "DC") {
      this.state.Loads_DC.push(newItem);
    }
  }

  render() {
    let step1_currentMethod;
    let step1_view;

    switch (this.state.energyRequirementMethod) {
      case 0:
        step1_currentMethod = "Select Capacity Computation Method";
        step1_view = (
          <div className="alert alert-warning" role="alert">
            No Computation method Selected. Please select a capacity computation method from the list above
          </div>
        )
        break;

      case 1:
        step1_currentMethod = "Direct Capacity Input"
        step1_view = (
          <div className="d-flex justify-content-center">
            <form className="form-inline">
              <div className="form-group mx-sm-3 mb-2">
                <div className="input-group ">
                  <input onChange={this.onChange_DirectInput_value} min={1} type="number" className="form-control" id="value_kwh" placeholder="Value in Wh" aria-label="Value in Wh" aria-describedby="basic-addon2" />
                  <div className="input-group-append">
                    <span className="input-group-text" id="basic-addon2">Wh</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={this.compute_TotalEnergyRequirement} className="btn btn-primary mb-2">Compute</button>
            </form>
          </div>
        )
        break;

      case 2:
        step1_currentMethod = "Individual Load Input"
        let tableData = this.state.Loads_AC.concat(this.state.Loads_DC)
        let tableRows = tableData.map((item, index) => {
          return <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{item.name}</td>
            <td>{item.type}</td>
            <td>{item.wattage}</td>
            <td>{item.dailyUsage}</td>
            <td>{item.weeklyUsage}</td>
          </tr>
        })
        step1_view = (
          <div>
            <div className="addedItems">
              <table className="table">
                <thead>
                  <tr >
                    <th scope="col">#</th>
                    <th scope="col">Load Name</th>
                    <th scope="col">Load Type</th>
                    <th scope="col">Wattage Used per day (W)</th>
                    <th scope="col">Hours Used per day</th>
                    <th scope="col">Days used per week</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows}
                </tbody>
              </table>
            </div>
            <div className="row ">
              <button type="button" data-toggle="modal" data-target="#addApplianceModal" className="btn btn-secondary btn-block">Add Item</button>
              <button type="button" onClick={this.compute_TotalEnergyRequirement} className="btn btn-primary btn-block">Compute Load Requirement</button>
            </div>
          </div>
        )
        break;

      default:
        step1_currentMethod = "Select Capacity Computation Method"
        step1_view = (
          <div>
            No input method selected yet. Please select an input method
          </div>
        )
        break;
    }
    return (
      <div className="App">

        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h3>Solar System Design Calculator</h3>
          </div>
        </div>
        <div className="step_1" style={{
          marginBottom: 50
        }}>
          <div className="row">
            <div className="col-sm-3 offset-sm-1">
              <div className="d-flex justify-content-start">
                <h2>
                  Step 1: Load Capacity Input
                </h2>
              </div>
            </div>
            <div className="col-sm-1">
              <div className="d-flex justify-content-start">
                <div className="dropdown" style={{
                  fontSize: "17px"
                }}>
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {step1_currentMethod}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <button onClick={() => {
                      this.setState({ energyRequirementMethod: 1 })
                    }} className="dropdown-item" type="button">Direct Capacity Input</button>
                    <button onClick={() => {
                      this.setState({ energyRequirementMethod: 2 })
                    }} className="dropdown-item" type="button">Individual Load Input</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="row" style={{
              marginTop: 30
            }}>
              <div className="col-sm-4 offset-sm-1 d-flex justify-content-start">
                {step1_view}
              </div>
              <div className="col-sm-2">
                <div>
                  <label htmlFor="inverterEffeciency">Inverter Effeciency</label>
                  <input type="range" onChange={this.onChange_inverterEffeciency} step="15" className="custom-range" min="50" max="95" id="inverterEffeciency" />
                  {this.state.inverterEfficiency}%
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card" style={{ width: 400 }}>
                  <div className="card-header">
                    Total Load Capacity
                 </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"> <b> {this.state.TotalEnergyRequirement.toFixed(2)} Wh</b></li>
                  </ul>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"> <b> {(this.state.TotalEnergyRequirement / 1000).toFixed} KWh</b></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="step_2" style={{
          marginBottom: 50
        }} >
          <div className="row">
            <div className="col-sm-4 offset-sm-1">
              <div className="d-flex justify-content-start">
                <h2>
                  Step 2: Panel Wattage
                </h2>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="customRange3">Battery Eff.</label>
                  <input onChange={this.onChange_batteryEffeciency} type="range" className="custom-range" defaultValue="50" min="50" max="95" step="15" id="batteryEffeciency" />
                  {this.state.batteryEffeciency} %
                </div>
                <div className="col">
                  <label htmlFor="customRange3">PV Array Eff.</label>
                  <input onChange={this.onChange_pvArrayEffeciency} type="range" className="custom-range" defaultValue="50" min="50" max="95" step="15" id="pvArrayEffeciency" />
                  {this.state.pvArrayEffeciency} %
                </div>
                <div className="col">
                  <label htmlFor="customRange3">T.S.R.F.</label>
                  <input onChange={this.onChange_TSRF} type="range" className="custom-range" defaultValue="50" min="50" max="95" step="15" id="tsrf" />
                  {this.state.tsrf} %
                </div>
                <div className="col">
                  <label htmlFor="customRange3">Peak Sun Hours</label>
                  <input onChange={this.onChange_PeakSunHours} type="range" className="custom-range" defaultValue="1" min="1" max="12" step="0.5" id="peakSunHours" />
                  {this.state.peakSunHours} Hour(s)
                </div>
              </div>
            </div>

            <div className="col-sm-1 offset-sm-1 d-flex align-items-center">
              <button onClick={this.compute_PVArrayRating} type="button" className="btn btn-primary">Compute</button>
            </div>

            <div className="col-sm-3">
              <div className="card" style={{ width: 400 }}>
                <div className="card-header">
                  PV Array Rating
                 </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"> <b> {this.state.PVArrayRating.toFixed(2)} W</b></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="step_3" style={{
          marginBottom: 50
        }}>
          <div className="row">
            <div className="col-sm-4 offset-sm-1">
              <div className="d-flex justify-content-start">
                <h2>
                  Step 3: Battery Information
                </h2>
              </div>
              <div className="row">
                <div className="col">
                  <label htmlFor="customRange3">Expected Days of Autonomy</label>
                  <input onChange={this.onChange_DaysOfAutonomy} type="number" min="1" defaultValue="1" className="form-control" id="daysOfAutonomy" placeholder="Enter Days of Autonomy" />
                </div>
                <div className="col">
                  <label htmlFor="customRange3">Temperature Compensation</label>
                  <input onChange={this.onChange_TempCompensation} type="range" className="custom-range" defaultValue="50" min="50" max="95" step="15" id="tsrf" />
                  {this.state.tempCompensation} %
                </div>
                <div className="col">
                  <label htmlFor="customRange3">Allowed Depth of Discharge</label>
                  <input onChange={this.onChange_DepthOfDischarge} type="range" className="custom-range" defaultValue="50" min="50" max="95" step="15" id="tsrf" />
                  {this.state.depthOfDischarge} %
                </div>
                <div className="col">
                  <label htmlFor="customRange3">Nominal System Voltage</label>
                  <input onChange={this.onChange_NominalVoltage} type="range" className="custom-range" defaultValue="12" min="12" max="48" step="12" id="peakSunHours" />
                  {this.state.nominalVoltage} V
                </div>
              </div>
            </div>
            <div className="col-sm-1 offset-sm-1 d-flex align-items-center">
              <button onClick={this.compute_BatteryCapacity} type="button" className="btn btn-primary">Compute</button>
            </div>

            <div className="col-sm-3">
              <div className="card" style={{ width: 400 }}>
                <div className="card-header">
                  System Battery Capacity
                 </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"> <b> {this.state.BatteryCapacity.toFixed(2)} Ah</b></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="step_4" style={{
          marginBottom: 50
        }}>
          <div className="row">
            <div className="col-sm-4 offset-sm-1">
              <div className="d-flex justify-content-start">
                <h2>
                  Step 4: Inverter Rating
                </h2>
              </div>
              <div className="row ">
                <div className="col d-flex justify-content-start">
                  Please indicate prescence of Inductive loads (e.g Electric Heaters, blenders, etc)
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-check form-check-inline">
                    <input defaultChecked={true} onChange={this.onChange_PresenceOfInductiveLoads} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={false} />
                    <label className="form-check-label" htmlFor="inlineRadio1">No</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input onChange={this.onChange_PresenceOfInductiveLoads} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={true} />
                    <label className="form-check-label" htmlFor="inlineRadio2">Yes</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-1 offset-sm-1 d-flex align-items-center">
              <button onClick={this.compute_InverterRating} type="button" className="btn btn-primary">Compute</button>
            </div>

            <div className="col-sm-3 ">
              <div className="card" style={{ width: 400 }}>
                <div className="card-header">
                  System Inverter Rating
                 </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"> <b> {this.state.InverterRating.toFixed(2)} W</b></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addApplianceModal" tabIndex="-1" role="dialog" aria-labelledby="addApplianceModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Appliance Form</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="inputApplianceName">Appliance Name</label>
                    <input required type="text" onChange={this.onChange_NewItem_name} className="form-control" id="inputApplianceName" aria-describedby="ApplianceName" placeholder="Appliance Name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputApplianceWattage">Appliance Wattage</label>
                    <input type="number" defaultValue="1" min="1" onChange={this.onChange_NewItem_wattage} className="form-control" id="inputApplianceWattage" aria-describedby="Appliance Wattage" placeholder="Appliance Wattage" />
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col">
                        <label htmlFor="DailyUsageFormControl_select">Hours/day</label>
                        <select defaultValue="1" id="DailyUsageFormControl_select" type="text" className="form-control" placeholder="First name" onChange={this.onChange_NewItem_dailyUsage}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                          <option value="13">13</option>
                          <option value="14">14</option>
                          <option value="15">15</option>
                          <option value="16">16</option>
                          <option value="17">17</option>
                          <option value="18">18</option>
                          <option value="19">19</option>
                          <option value="20">20</option>
                          <option value="21">21</option>
                          <option value="22">22</option>
                          <option value="23">23</option>
                          <option value="24">24</option>
                        </select>
                      </div>
                      <div className="col">
                        <label htmlFor="WeeklyUsageFormControl_select">Days/Week</label>
                        <select defaultValue="1" id="WeeklyUsageFormControl_select" type="number" className="form-control" placeholder="Select Days/Week" onChange={this.onChange_NewItem_weeklyUsage} >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </select>
                      </div>
                      <div className="col">
                        <label htmlFor="LoadTypeControl_select">Load Type</label>
                        <select defaultValue="AC" id="LoadTypeControl_select" type="text" className="form-control" placeholder="Select Load Type" onChange={this.onChange_NewItem_type}>
                          <option value="AC">AC</option>
                          <option value="DC">DC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                {this.state.incompleteFieldError_step1_method_1 && <div className="container incomplete-field-warning-text">
                  Please ensure all fields are filled
                </div>}
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="sumbit" onClick={() => {
                  if (this.state.newItem.name.length > 0) {
                    this.create_NewItem()
                    this.setState({ incompleteFieldError_step1_method_1: false })
                  } else {
                    this.setState({ incompleteFieldError_step1_method_1: true })
                  }
                }} className="btn btn-primary">Add Item</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default App;