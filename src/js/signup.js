import env from './env';
import util from './util';

export default function() {
  class SignUp extends React.Component {
    displayName = 'SignUp';

    state = {
      errorMessage: null,
      submitting: false,
      accountCreated: false,
      accountConfirmed: false,

      email: '',
      password: '',
      passwordConfirmation: '',
      confirmationCode: ''
    };

    componentDidMount() {
      this.refs.emailField.focus();
    }

    handleChangeFn = (name) => {
      return (e) => {
        this.setState({[name]: e.target.value});
      };
    };

    handleSubmitCreate = (e) => {
      e.preventDefault();

      const { email, password, passwordConfirmation } = this.state;

      if (password !== passwordConfirmation) {
        this.setState({ errorMessage: 'Passwords do not match. Please re-enter password.' });
        return;
      }

      this.setState({
        submitting: true,
        errorMessage: null
      });

      $.ajax({
        type: 'POST',
        url: env.host + '/users',
        headers: {
          Accept: env.reqAccept
        },
        data: { email, password, anonymous_id: window.analytics.user().anonymousId() }
      }).then(() => {
        this.setState({
          accountCreated: true,
          submitting: false,
          password: '',
          passwordConfirmation: ''
        }, () => {
          this.refs.confirmationCodeField.focus();
        });

        window.ga('send', 'event', {
          eventCategory: 'Form Submit',
          eventAction: 'sign-up-success',
          eventLabel: 'create account button',
          transport: 'beacon'
        });

      }, (jqxhr) => {
        const r = jqxhr.responseJSON;
        if (jqxhr.status === 422 && typeof r === 'object' && r.error === 'invalid_params' && typeof r.errors === 'object') {
          const errMsg = $.map(r.errors, (v, k) => `${util.capitalize(k)} ${v}.`).join(' ');
          this.setState({
            errorMessage: errMsg,
            submitting: false
          }, () => {
            this.refs.emailField.select();
            this.refs.emailField.focus();
          });
        }
      });
    };

    handleSubmitConfirm = (e) => {
      e.preventDefault();

      const { email, confirmationCode } = this.state;

      this.setState({
        submitting: true,
        errorMessage: null
      });

      $.ajax({
        type: 'POST',
        url: env.host + '/user/confirm',
        headers: {
          Accept: env.reqAccept
        },
        data: {
          email,
          confirmation_code: confirmationCode,
          anonymous_id: window.analytics.user().anonymousId()
        }
      }).then(() => {
        this.setState({
          accountConfirmed: true,
          submitting: false,
          confirmationCode: ''
        }, () => {
          this.refs.getStartedBtn.focus();
        });

        window.ga('send', 'event', {
            eventCategory: 'Form Submit',
            eventAction: 'sign-up-confirmation',
            eventLabel: 'confirm account button',
            transport: 'beacon'
        });

      }, (jqxhr) => {
        const r = jqxhr.responseJSON;
        if (jqxhr.status === 422 && typeof r === 'object' && r.error === 'invalid_params' && r.error_description === 'invalid email or confirmation_code') {
          this.setState({
            errorMessage: 'You have entered an incorrect confirmation code. Please try again.',
            submitting: false
          }, () => {
            this.refs.confirmationCodeField.select();
            this.refs.confirmationCodeField.focus();
          });
        }
      });
    };

    render() {
      const { state } = this;

      return (
        <div className='signup-component'>
          {state.errorMessage ? (
            <div className="alert alert-danger" role="alert">{state.errorMessage}</div>
          ) : ''}
          {!state.accountCreated ? (
            <form onSubmit={this.handleSubmitCreate}>
              <div className="form-group">
                <input ref='emailField' className="form-control" type="email" name="email" placeholder="Email" minLength="5" required disabled={state.submitting} onChange={this.handleChangeFn('email')} value={state.email} />
              </div>
              <div className="form-group">
                <input className="form-control" type="password" name="password" placeholder="Password" minLength="6" maxLength="72" required disabled={state.submitting} onChange={this.handleChangeFn('password')} value={state.password} />
              </div>
              <div className="form-group">
                <input className="form-control" type="password" placeholder="Confirm Password" required disabled={state.submitting} onChange={this.handleChangeFn('passwordConfirmation')} value={state.passwordConfirmation} />
              </div>

              <div className="form-group">
                <button className="btn btn-primary" disabled={state.submitting}>
                  {state.submitting ? (
                    <span>
                      <i className='fa fa-spin fa-circle-o-notch' />
                      Creating an Account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>
          ) : ''}
          {state.accountCreated && !state.accountConfirmed ? (
            <form onSubmit={this.handleSubmitConfirm}>
              <div className="alert alert-success" role="alert">
                Your PubStorm account has been created. Please confirm your account by entering the confirmation code that was sent to your email address.
              </div>

              <div className="form-group">
                <input ref='confirmationCodeField' className="form-control" type="text" pattern='[0-9]{6}' title='6-digit numeric confirmation code that was sent to you via email' placeholder="Confirmation Code (Check your inbox!)" minLength="6" maxLength="6" required disabled={state.submitting} onChange={this.handleChangeFn('confirmationCode')} value={state.confirmationCode} />
              </div>

              <div className="form-group">
                <button className="btn btn-primary" disabled={state.submitting}>
                  {state.submitting ? (
                    <span>
                      <i className='fa fa-spin fa-circle-o-notch' />
                      Confirming Account...
                    </span>
                  ) : 'Confirm Account'}
                </button>
              </div>
            </form>
          ) : ''}
          {state.accountConfirmed ? (
            <div>
              <div className="alert alert-success" role="alert">
                Thanks for confirming your PubStorm account! Please click on the button below to get started!
              </div>
              <a ref='getStartedBtn' className="btn btn-lg btn-primary" href="http://help.pubstorm.com/getting-started/getting-started/">
                <i className='fa fa-arrow-circle-right' />
                Get Started
              </a>
            </div>
          ) : ''}
        </div>
      );
    }
  }

  ReactDOM.render(<SignUp />, document.getElementById('signup-app'));
}
