import React from 'react';
import gql from "graphql-tag";
import { Frontier } from "frontier-forms";
import { storiesOf } from '@storybook/react';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

storiesOf('<Frontier>', module)
  .add('with a static schema using `schema` props', () => {
    const schema = {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "properties": {
        "Query": {
          "type": "object",
          "properties": {
            "todo": {
              "type": "object",
              "properties": {
                "return": {
                  "$ref": "#/definitions/Todo"
                },
                "arguments": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id"
                  ]
                }
              },
              "required": []
            },
            "todos": {
              "type": "object",
              "properties": {
                "return": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/Todo"
                  }
                },
                "arguments": {
                  "type": "object",
                  "properties": {},
                  "required": []
                }
              },
              "required": []
            }
          },
          "required": []
        },
        "Mutation": {
          "type": "object",
          "properties": {
            "update_todo": {
              "type": "object",
              "properties": {
                "return": {
                  "$ref": "#/definitions/Todo"
                },
                "arguments": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "todo": {
                      "$ref": "#/definitions/TodoInputType"
                    }
                  },
                  "required": [
                    "id",
                    "todo"
                  ]
                }
              },
              "required": []
            },
            "create_todo": {
              "type": "object",
              "properties": {
                "return": {
                  "$ref": "#/definitions/Todo"
                },
                "arguments": {
                  "type": "object",
                  "properties": {
                    "todo": {
                      "$ref": "#/definitions/TodoInputType"
                    }
                  },
                  "required": [
                    "todo"
                  ]
                }
              },
              "required": []
            },
            "update_online_status": {
              "type": "object",
              "properties": {
                "return": {
                  "$ref": "#/definitions/OnlineStatus"
                },
                "arguments": {}
              },
              "required": []
            }
          },
          "required": []
        }
      },
      "definitions": {
        "Todo": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "completed": {
              "type": "boolean"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "TodoInputType": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "completed": {
              "type": "boolean"
            }
          },
          "required": [
            "name"
          ]
        },
        "OnlineStatus": {
          "type": "object",
          "properties": {
            "onlineStatus": {
              "type": "string"
            }
          },
          "required": [
            "onlineStatus"
          ]
        }
      }
    };

    const mutation = gql`
        mutation createTodo($todo: TodoInputType!) {
          create_todo(todo: $todo) {
            id
          }
        }
    `;

    return (
      <Frontier mutation={mutation} schema={schema} initialValues={{ todo: { name: 'Todo 1' } }}>
        {
          ({ state, modifiers, form }) => {
            console.log(state);
            console.log(modifiers);
            return (
              <form /* onSubmit={modifiers.save} */>
                <h2>Create a todo</h2>
                <p>
                  <label htmlFor="name">Name*</label> <br />
                  <input
                    type="text"
                    name="name"
                    value={state.values.todo.name} onChange={e => modifiers.todo.name.change(e.currentTarget.value.length > 0 ? e.currentTarget.value : null)}
                  />
                  <p>
                    Value: "{state.values.todo.name}"
                  </p>
                  {state.errors.todo && state.errors.todo.name &&
                    <p>
                      Error: "{state.errors.todo.name}"
                  </p>
                  }
                </p>
                <p>
                  <input type="submit" value="Save" />
                </p>
              </form>
            )
          }
        }
      </Frontier>
    )
  }).
  add('with a dynamic schema using `client` props', () => {
    const mutation = gql`
      mutation ($name: String!) {
        createCat(name: $name) {
          id
          name
        }
      }
    `;

    // https://api.graph.cool/simple/v1/cj1g3qeupseze0109blq0g4mg
    const client = new ApolloClient({
      link: createHttpLink({ uri: 'https://api.graph.cool/simple/v1/cj1g3qeupseze0109blq0g4mg' }),
      cache: new InMemoryCache()
    });

    return (
      <Frontier mutation={mutation} client={client} initialValues={{ name: 'My cat' }}>
        {
          ({ state, modifiers, form }) => {
            console.log(state);
            console.log(modifiers);
            return (
              <form /* onSubmit={modifiers.save} */>
                <h2>Create a cat</h2>
                <p>
                  <label htmlFor="name">Name*</label> <br />
                  <input
                    type="text"
                    name="name"
                    value={state.values.name} onChange={e => modifiers.name.change(e.currentTarget.value.length > 0 ? e.currentTarget.value : null)}
                  />
                  <p>
                    Value: "{state.values.name}"
                  </p>
                  {state.errors.cat && state.errors.name &&
                    <p>
                      Error: "{state.errors.name}"
                  </p>
                  }
                </p>
                <p>
                  <input type="submit" value="Save" />
                </p>
              </form>
            )
          }
        }
      </Frontier>
    )
  });
