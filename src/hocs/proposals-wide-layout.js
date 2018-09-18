import React from 'react'
import AppWrapper from './app-wrapper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import ListIcon from '@material-ui/icons/List'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {connect} from 'react-redux'
import {getUser} from '../actions/users'
import {
  handleProfileMenu,
  handleDaoMenu
} from '../actions/ui'
import {
  login,
  logout
} from '../actions/auth'
import {resetNewProposal} from '../actions/proposals'
import logoImage from './logo.png'

const styles = theme => ({
  logo: {
    maxHeight: '80px',
    maxWidth: '100px'
  },
  logoContainer: {
    flexGrow: 1
  },
  contentBase: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: `100%`
  },
  contentRoot: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    marginTop: '40px'
  }
})

const mapStateToProps = (state, ownProps) => {  
  return {
    user: state.users['wulf@semada.io'],
    access_token: state.auth.access_token,
    id_token: state.auth.id_token,
    expires_at: state.auth.expires_at,
    auth0: state.auth.auth0,
    profileMenuAnchorEl: state.ui.profileMenuAnchorEl,
    daoMenuAnchorEl: state.ui.daoMenuAnchorEl
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getUser: email => {
      return dispatch(getUser(email))
    },
    handleNewProposalClick: () => {
      dispatch(resetNewProposal())
      ownProps.history.push('/proposals/new')  
    },
    handleProfileMenu: (event) => {
      dispatch(handleProfileMenu(event.currentTarget))
    },
    handleCloseProfileMenu: () => {
      dispatch(handleProfileMenu(null))
    },
    handleDaoMenu: (event) => {
      dispatch(handleDaoMenu(event.currentTarget))
    },
    handleCloseDaoMenu: () => {
      dispatch(handleDaoMenu(null))
    },
    login: (auth0) =>{
      dispatch(login(auth0))
    },
    logout: () =>{
      dispatch(logout())
    }
  }
}

const LayoutHOC = Page => class Layout extends React.Component {

  componentDidMount() {
    // TODO : Remove hard coding
    this.props.getUser('wulf@semada.io')
  }
  
  render () {
    
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <div className={this.props.classes.logoContainer}>
              <img src={logoImage} className={this.props.classes.logo} alt='Semada' />  
            </div>
            
            <Typography>
              SEM Balance: <b>{this.props.user ? this.props.user.sem: ''}</b>
            </Typography>
            &nbsp;
            <Typography>
              REP Balance: <b>{this.props.user ? this.props.user.rep: ''}</b>
            </Typography>

            <Button
              aria-owns={Boolean(this.props.daoMenuAnchorEl) ? 'render-props-menu' : null}
              aria-haspopup="true"
              onClick={this.props.handleDaoMenu}
              color="inherit"
            >
            <ListIcon />
              DAOS
            </Button>
            <Menu 
              id="render-props-menu" 
              anchorEl={this.props.daoMenuAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(this.props.daoMenuAnchorEl)} 
              onClose={this.props.handleCloseDaoMenu}>
              <MenuItem onClick={() => {
                this.props.handleCloseDaoMenu()
                this.props.history.push('/daos')
              }}>Community Meetup</MenuItem>
              <MenuItem onClick={() => {
                this.props.handleCloseDaoMenu()
                this.props.history.push('/proposals')
              }}>News Verification</MenuItem>
            </Menu>

            {( ( this.props.expires_at == null ) || new Date().getTime() >= this.props.expires_at ) && (
                <Button color='inherit'
              onClick={ () => {
                  this.props.handleCloseProfileMenu()
                  this.props.login(this.props.auth0)
                  }}
            >
              Login
            </Button>
            )}

            { ( this.props.expires_at && new Date().getTime() < this.props.expires_at ) && (
            <div>
              <Button color='inherit'
                onClick={() => {
                  this.props.handleNewProposalClick()
                }}
              >
                <AddIcon />
                New Proposal
              </Button>
              <IconButton
                aria-owns={ Boolean(this.props.profileMenuAnchorEl) ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.props.handleProfileMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.props.profileMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={ Boolean(this.props.profileMenuAnchorEl) }
                onClose={this.props.handleCloseProfileMenu}
              >
                <MenuItem onClick={() => {
                  this.props.handleCloseProfileMenu()
                  this.props.history.push(`/users/${this.props.user.email}`)
                }} >Profile</MenuItem>
                <MenuItem onClick={ () => {
                  this.props.handleCloseProfileMenu()
                  this.props.logout()
                  }}>Logout</MenuItem>
              </Menu>
            </div>
            )}   
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.contentBase}>
          <div className={this.props.classes.contentRoot}>
            <div className={this.props.classes.content}>
              <Page {...this.props} /> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page => withStyles(styles)(AppWrapper(
  connect(mapStateToProps, mapDispatchToProps)(LayoutHOC(Page))
))