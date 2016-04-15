/* jshint esversion: 6 */
(function(React, ReactDOM, $) {
	'use strict';

	var container = document.getElementById('app'),
		Dictionary = React.createClass({
			propTypes: {
				count: function(props, propName) {
					if (typeof props[propName] !== 'number') {
						return new Error('The count property must be a number');
					}
					if (props[propName] > 100) {
						return new Error(`Creating ${props[propName]} definitions is a bit much ...`)
					}
				}
			},
			getInitialState: function() {
				return { 
					doThing: false,
					definitions: []
				};
			},
			componentWillMount: function() {
				var definitions = [];

				// Definition array contains definitions
				$.getJSON('/definitions', (results) => {
					results.forEach(result => {
						definitions.push({
							id: result._id,
							name: result.term,
							definition: result.defined
						});
					});
					this.setState({definitions: definitions});
				});
			},
			changeItUp: function() {
				var status = this.state.doThing;
				this.setState({ doThing: !status });
			},
			doThing: function() {
				return (
					<div className="dictionary" onClick={this.changeItUp}>Good luck</div>
				);
			},
			update: function(term, definition, index) {
				var updatedDefinition 	= { name: term, definition: definition, id: index },
					definitionArray 	= this.state.definitions;

				definitionArray[index] = updatedDefinition;
				this.setState({ definitions: definitionArray });
			},
			eachDefinition: function(term, i) {
				return (
					<Definition 
						key={term.id}
						id={term.id}
						index={i} 
						name={term.name} 
						definition={term.definition}
						onChange={this.update}>
					</Definition>
				);
			},
			addTerm: function() {
				var arr = this.state.definitions,
					newDefinition = {
						id: this.nextId(),
						name: '',
						definition: ''
					};
				arr.push(newDefinition);
				this.setState({ definitions: arr });
			},
			nextId: function() {
				this.uniqueId = this.uniqueId || 0;
				return this.uniqueId++;
			},
			renderDisplay: function() {
				return (
					<div className="dictionary">
						{this.state.definitions.map(this.eachDefinition)}
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-default" onClick={this.addTerm}>Add term</div>
					</div>
				);
			},
			render: function() {
				if (this.state.doThing) {
					return this.doThing();
				} else {
					return this.renderDisplay();
				}
			}
		}),
		Definition = React.createClass({
			getInitialState: function() {
				if (!!this.props.name) {
					return { edit: false };
				} else {
					return { edit: true };
				}
			},
			saveDefinition: function() {
				var name 		= this.refs.termName.value,
					definition 	= this.refs.termDefinition.value;
				
				this.setState({ edit: false });

				$.post({
					url: `/definitions?id=${this.props.id}`,
					data: {
						id: this.props.id,
						term: name,
						defined: definition
					},
					success: function(res) {
						this.props.onChange(name, definition, this.props.index);
						console.log('success')
					},
					failure: function(res) {
						console.log('fail');
					}
				}).bind(this);				
				
			},
			editDefinition: function() {
				this.setState({ edit: true });
			},
			renderEdit: function() {
				return (
					<article className="definition definition__edit row">
						<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
							<input ref="termName" placeholder="Term to define" defaultValue={this.props.name} autofocus/>
						</div>
						<div className="col-lg-8 col-md-8 col-sm-6 col-sx-12">
							<textarea ref="termDefinition" defaultValue={this.props.definition}>
							</textarea>
						</div>
						<div className="col-lg-3 col-md-3 col-sm-6 col-sx-12 button">
							<button className="btn btn-success" onClick={this.saveDefinition}>Save</button>
						</div>
					</article>
				);
			},
			renderDisplay: function() {
				return (
					<article className="definition definition__edit row">					
						<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
							<dt ref="termName">{this.props.name}</dt>
						</div>
						<div className="col-lg-8 col-md-8 col-sm-6 col-sx-12">
							<dd ref="termDefinition">{this.props.definition}</dd>
						</div>
						<div className="col-lg-3 col-md-3 col-sm-6 col-sx-12 button">
							<button className="btn btn-primary" onClick={this.editDefinition}>Edit</button>
						</div>
					</article>
				);
			}, 
			render: function() {
				if (this.state.edit) {
					return this.renderEdit();
				} else {
					return this.renderDisplay();
				}
			}
		});

	ReactDOM.render(<Dictionary count={10}/>, container);
}(window.React, window.ReactDOM, window.jQuery, undefined));
