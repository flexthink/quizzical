import React, {Component} from 'react';
import { connect } from 'react-redux';

export function routeTo(inner, onLoad = null, ...argParams) {
    class Wrapper extends Component {        
        componentDidMount() {
            const argValues = argParams.map(param => this.props.match.params[param]);
            this.props.onLoad(...argValues);            
        }

        render() {
            return React.createElement(inner);
        }
    }
    const mapStateToProps = state => state;
    const mapDispatchToProps = dispatch => ({
        onLoad: (...args) => dispatch(onLoad(...args)),
    });
    return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
}
