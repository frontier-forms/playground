import 'semantic-ui-css/semantic.min.css'

import React from 'react';
import gql from "graphql-tag";
import ApolloClient from 'apollo-client';
import { Frontier } from "frontier-forms";
import { storiesOf } from '@storybook/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { SemanticUIkit } from '@frontier-forms/ui-kit-semantic-ui';
import { Message, Step } from 'semantic-ui-react';

class MutationSelector extends React.Component {
  state = { mutation: '' }

  componentDidMount() {
    this.setState({
      mutation: Object.keys(this.props.mutations)[0]
    });
  }

  onChange = (e) => {
    this.setState({
      mutation: e.currentTarget.value
    });
  }

  render() {
    return (
      <div>
        <br />
        <select onChange={this.onChange}>
          {
            Object.keys(this.props.mutations).map(m => {
              return (
                <option value={m} key={m}>{m}</option>
              )
            })
          }
        </select>
        <br />
        <br />
        <div style={{ paddingLeft: '50px' }}>
          <div style={{ width: '300px' }}>
            <Frontier
              client={this.props.client}
              mutation={this.props.mutations[this.state.mutation]}
              uiKit={this.props.uiKit}
              order={
                this.state.mutation == 'createUser' ?
                  ['email'] :
                  undefined
              }
            />
          </div>
        </div>
      </div>
    )
  }
}

storiesOf('React Europe 2019 demo', module)
  .add('Simple forms example', () => {
    const mutations = {
      'createUser': gql`
      mutation ($company: String!, $email: String!, $firstname: String!, $lastname: String!) {
        createUser(company: $company, email: $email, firstname: $firstname, lastname: $lastname) {
          id
        }
      }
    `,
      'createCat': gql`
      mutation ($name: String!) {
        createCat(name: $name) {
          id
          name
        }
      }
    `
    };

    const client = new ApolloClient({
      link: createHttpLink({ uri: 'https://api.graph.cool/simple/v1/cj1g3qeupseze0109blq0g4mg' }),
      cache: new InMemoryCache()
    });

    return (
      <div>
        <h2>Create a Cat or a User</h2>
        <MutationSelector mutations={mutations} client={client} uiKit={SemanticUIkit} />
      </div>
    );
  })
  .add('Simple User form with Semantic UI and render props', () => {

    const mutation = gql`
      mutation ($company: String!, $email: String!, $firstname: String!, $lastname: String!) {
        createUser(company: $company, email: $email, firstname: $firstname, lastname: $lastname) {
          id
        }
      }
    `;

    const client = new ApolloClient({
      link: createHttpLink({ uri: 'https://api.graph.cool/simple/v1/cj1g3qeupseze0109blq0g4mg' }),
      cache: new InMemoryCache()
    });

    return (
      <div>
        <div style={{ paddingLeft: '50px' }}>
          <div style={{ width: '445px' }}>
            <Frontier client={client} mutation={mutation} uiKit={SemanticUIkit}>
              {
                ({ form, kit }) => {
                  return (
                    <form
                      className={form.getState().submitting ? 'ui form loading' : 'ui form'}
                      onSubmit={(e) => { e.preventDefault(); form.submit(); }}
                    >
                      <p>&nbsp;</p>
                      <Step.Group ordered>
                        <Step active>
                          <Step.Content>
                            <Step.Title>Create your account</Step.Title>
                            {/* <Step.Description>Choose your shipping options</Step.Description> */}
                          </Step.Content>
                        </Step>

                        <Step disabled>
                          <Step.Content>
                            <Step.Title>Create a project</Step.Title>
                          </Step.Content>
                        </Step>
                      </Step.Group>

                      <div>
                        {kit.company()}
                      </div>
                      <Message
                        info
                        header='Is my company already registered?'
                        list={[
                          'If your company is already registred under a Business plan, please do register using the Business form',
                        ]}
                      />
                      <br />
                      <div>
                        {kit.email()}
                      </div>
                      <br />
                      <div>
                        {kit.firstname()}
                      </div>
                      <br />
                      <div>
                        {kit.lastname()}
                      </div>
                      <p>
                        <input type="submit" value="Save" className="ui button" />
                      </p>
                    </form>
                  )
                }
              }
            </Frontier>
          </div>
        </div>
      </div >
    );
  })
  .add('Custom UI-kit component', () => {
    const mutation = gql`
      mutation ($rating: Int!, $comment: String!) {
        createFeedback(rating: $rating, comment: $comment) {
          id
        }
      }
    `;

    const client = new ApolloClient({
      link: createHttpLink({ uri: 'https://api.graph.cool/simple/v1/cj1g3qeupseze0109blq0g4mg' }),
      cache: new InMemoryCache()
    });

    return (
      <div>
        <div style={{ paddingLeft: '50px' }}>
          <div style={{ width: '445px' }}>
            <Frontier
              resetOnSave={true}
              client={client}
              mutation={mutation}
              uiKit={SemanticUIkit}
            />
          </div>
        </div>
      </div>
    );
  })
  .add('User form with email constraints', () => {
    return <div />;
  })
