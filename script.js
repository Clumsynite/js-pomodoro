let app = document.getElementById('app')

class Clock extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      status: 'stopped',
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerText: 'Session',
      interval: '',
      btnText: 'Start'
    }
    this.setBreak = this.setBreak.bind(this)
    this.setSession = this.setSession.bind(this)
    this.formatTime = this.formatTime.bind(this)
    this.getTimeLeft = this.getTimeLeft.bind(this)
    this.startStop = this.startStop.bind(this)
    this.reset = this.reset.bind(this)
    this.countdown = this.countdown.bind(this)
  }
  setBreak = () => {
    const value = event.target.value
    if(this.state.status==='started'){return}
    if(value === '+' && (this.state.breakLength + 1) <=60){
      this.setState({breakLength: this.state.breakLength+=1})
    }else if(value==='-'  && (this.state.breakLength - 1) >=1){
      this.setState({breakLength: this.state.breakLength-=1})
    }
  }
  setSession = () => {
     const value = event.target.value
    if(this.state.status==='started'){return}
    if(value === '+' && (this.state.sessionLength + 1) <=60){
      this.setState({
        sessionLength: this.state.sessionLength+=1,
        timeLeft: this.state.sessionLength * 60
      })
    }else if(value==='-'  && (this.state.sessionLength - 1) >=1){
      this.setState({
        sessionLength: this.state.sessionLength-=1,
        timeLeft: this.state.sessionLength * 60
      })
    }
  }
  formatTime = (sec) => {
    var min = Math.floor(sec/60);
    (min >= 1) ? sec = sec - (min*60) : min = '00';
    (sec < 1) ? sec='00' : void 0;

    (min.toString().length == 1) ? min = '0'+min : void 0;    
    (sec.toString().length == 1) ? sec = '0'+sec : void 0;    

    return min+':'+sec;
  }
  getTimeLeft = () => {
    let timeLeft = this.state.timeLeft
    return this.formatTime(timeLeft)
  }
  countdown = () => {
    this.setState({timeLeft: this.state.timeLeft -= 1})
  }
  startStop = () => {
    const beep = document.querySelector('#beep')
    if(this.state.status==='stopped'){
      this.setState({
        btnText: 'Pause',
        status: 'started',
        interval: 
      setInterval(() => {
        if(this.state.timeLeft < 0 && this.state.timerText === 'Session'){
          this.setState({
          timerText: 'Break',
            timeLeft: this.state.breakLength * 60
          })
          
          beep.play()
        }else if(this.state.timeLeft < 0 && this.state.timerText === 'Break'){
          this.setState({
          timerText: 'Session',
            timeLeft: this.state.sessionLength * 60
          })
          beep.play()
        }else{this.countdown()}
      },1000)
      })
 
    }else if(this.state.status==='started'){
      this.setState({status: 'stopped', btnText: 'Start'})
      clearInterval(this.state.interval);
    }
  }
  reset = () => {
    const beep = document.querySelector('#beep')
    this.setState({
      status: 'stopped',
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerText: 'Session',
      btnText: 'Start'
    })
    clearInterval(this.state.interval)
    beep.pause()
    beep.currentTime = 0
  }
  render(){
    return(
    <div id='container'>
       <BreakSession nameID='break-label' name='Break length' decID='break-decrement' incID='break-increment' lenID='break-length' len={this.state.breakLength} click={this.setBreak}/>
       <BreakSession nameID='session-label' name='Session length' decID='session-decrement' incID='session-increment' lenID='session-length' len={this.state.sessionLength} click={this.setSession}/>
        <Timer label={this.state.timerText} timeLeft={this.getTimeLeft()} startStop={this.startStop} reset={this.reset} status={this.state.btnText}/>
      </div>
    )
  }
}

class BreakSession extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
     <div>
        <audio src='https://www.soundjay.com/misc/censor-beep-5.mp3' id='beep'></audio>
      <div id={this.props.nameID}>
        {this.props.name}
       </div>
        <div className='btns'>
          <button id={this.props.decID} onClick={this.props.click} value='-' className='hilo'>-</button> 
          <div id={this.props.lenID} className='len'>
            {this.props.len}
          </div>
          <button id={this.props.incID} onClick={this.props.click} value='+' className='hilo'>+</button> 
        </div>
      </div>
    )
  }
}

class Timer extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
    <div id='timer-div'>
       <div id='timer-label'>
          {this.props.label}
        </div>
        <div id='time-left'>
          {this.props.timeLeft}
        </div>
        <div id='controls'>
          <button id='start_stop' onClick={this.props.startStop} className='ctrl'>{this.props.status}</button>
          <button id='reset' onClick={this.props.reset} className='ctrl'>Replay</button>
         </div>
      </div>
    )
  }
}

ReactDOM.render(<Clock />, app)