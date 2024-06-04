import generate from '@babel/generator';
import { readFileSync, writeFileSync } from 'fs';
import * as t from "@babel/types";

class ModuleConfig{
  moduleName: string
  requestType: string
  responseType: string

  interfaceName: string
  hookName: string
  queryServiceMethodName: string
  keyName: string

  constructor(moduleName:string,types:Record<string,string>){
    if(!types?.requestType || !types?.responseType) return
    this.moduleName = moduleName;
    this.requestType = types?.requestType;
    this.responseType = types?.responseType;

    this.interfaceName = `Use${ModuleConfig.setFirtLetterUpperCase(moduleName)}Query`;
    this.hookName = `use${ModuleConfig.setFirtLetterUpperCase(moduleName)}`;
    this.queryServiceMethodName =ModuleConfig.setFirstLetterLowerCase(moduleName)
    this.keyName = `${ModuleConfig.setFirstLetterLowerCase(moduleName)}Query`;
  }

  static setFirtLetterUpperCase(name:string){
    return name.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  static setFirstLetterLowerCase(name:string){
    return name.replace(/\b\w/g, (char) => char.toLowerCase())
  }
}


const generateInterfaceAST = (conf: ModuleConfig) => {
  return  {
    "type": "ExportNamedDeclaration",
    "exportKind": "type",
    "specifiers": [],
    "source": null,
    "declaration": {
      "type": "TSInterfaceDeclaration",
      "id": {
        "type": "Identifier",
        "name": conf.interfaceName
      },
      "typeParameters": {
        "type": "TSTypeParameterDeclaration",
        "params": [
          {
            "type": "TSTypeParameter",
            "name": "TData"
          }
        ]
      },
      "extends": [
        {
          "type": "TSExpressionWithTypeArguments",
          "expression": {
            "type": "Identifier",
            "name": "ReactQueryParams"
          },
          "typeParameters": {
            "type": "TSTypeParameterInstantiation",
            "params": [
              {
                "type": "TSTypeReference",
                "typeName": {
                  "type": "Identifier",
                  "name": conf.responseType
                }
              },
              {
                "type": "TSTypeReference",
                "typeName": {
                  "type": "Identifier",
                  "name": "TData"
                }
              }
            ]
          }
        }
      ],
      "body": {
        "type": "TSInterfaceBody",
        "body": [
          {
            "type": "TSPropertySignature",
            "key": {
              "type": "Identifier",
              "name": "request"
            },
            "computed": false,
            "optional": true,
            "typeAnnotation": {
              "type": "TSTypeAnnotation",
              "typeAnnotation": {
                "type": "TSTypeReference",
                "typeName": {
                  "type": "Identifier",
                  "name": conf.requestType
                }
              }
            }
          }
        ]
      }
    }
  }
};

const generateHookAST = (conf: ModuleConfig) => {
  return {
    "type": "VariableDeclaration",
    "declarations": [
      {
        "type": "VariableDeclarator",
        "id": {
          "type": "Identifier",
          "name": conf.hookName
        },
        "init": {
          "type": "ArrowFunctionExpression",
          "id": null,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "ObjectPattern",
              "properties": [
                {
                  "type": "ObjectProperty",
                  "method": false,
                  "key": {
                    "type": "Identifier",
                    "name": "request"
                  },
                  "computed": false,
                  "shorthand": true,
                  "value": {
                    "type": "Identifier",
                    "name": "request"
                  },
                  "extra": {
                    "shorthand": true
                  }
                },
                {
                  "type": "ObjectProperty",
                  "method": false,
                  "key": {
                    "type": "Identifier",
                    "name": "options"
                  },
                  "computed": false,
                  "shorthand": true,
                  "value": {
                    "type": "Identifier",
                    "name": "options"
                  },
                  "extra": {
                    "shorthand": true
                  }
                }
              ],
              "typeAnnotation": {
                "type": "TSTypeAnnotation",
                "typeAnnotation": {
                  "type": "TSTypeReference",
                  "typeName": {
                    "type": "Identifier",
                    "name": conf.interfaceName
                  },
                  "typeParameters": {
                    "type": "TSTypeParameterInstantiation",
                    "params": [
                      {
                        "type": "TSTypeReference",
                        "typeName": {
                          "type": "Identifier",
                          "name": "TData"
                        }
                      }
                    ]
                  }
                }
              }
            }
          ],
          "body": {
            "type": "BlockStatement",
            "body": [
              {
                "type": "ReturnStatement",
                "argument": {
                  "type": "CallExpression",
                  "callee": {
                    "type": "Identifier",
                    "name": "useQuery"
                  },
                  "arguments": [
                    {
                      "type": "ArrayExpression",
                      "elements": [
                        {
                          "type": "StringLiteral",
                          "extra": {
                            "rawValue": `${conf.keyName}`,
                            "raw": `"${conf.keyName}"`
                          },
                          "value":`${conf.keyName}`
                        },
                        {
                          "type": "Identifier",
                          "name": "request"
                        }
                      ]
                    },
                    {
                      "type": "ArrowFunctionExpression",
                      "id": null,
                      "generator": false,
                      "async": false,
                      "params": [],
                      "body": {
                        "type": "BlockStatement",
                        "body": [
                          {
                            "type": "IfStatement",
                            "test": {
                              "type": "UnaryExpression",
                              "operator": "!",
                              "prefix": true,
                              "argument": {
                                "type": "Identifier",
                                "name": "queryService"
                              }
                            },
                            "consequent": {
                              "type": "ThrowStatement",
                              "argument": {
                                "type": "NewExpression",
                                "callee": {
                                  "type": "Identifier",
                                  "name": "Error"
                                },
                                "arguments": [
                                  {
                                    "type": "StringLiteral",
                                    "extra": {
                                      "rawValue": "Query Service not initialized",
                                      "raw": "\"Query Service not initialized\""
                                    },
                                    "value": "Query Service not initialized"
                                  }
                                ]
                              }
                            },
                            "alternate": null
                          },
                          {
                            "type": "ReturnStatement",
                            "argument": {
                              "type": "CallExpression",
                              "callee": {
                                "type": "MemberExpression",
                                "object": {
                                  "type": "Identifier",
                                  "name": "queryService"
                                },
                                "computed": false,
                                "property": {
                                  "type": "Identifier",
                                  "name": conf.queryServiceMethodName
                                }
                              },
                              "arguments": [
                                {
                                  "type": "Identifier",
                                  "name": "request"
                                }
                              ]
                            }
                          }
                        ],
                        "directives": []
                      }
                    },
                    {
                      "type": "Identifier",
                      "name": "options"
                    }
                  ],
                  "typeParameters": {
                    "type": "TSTypeParameterInstantiation",
                    "params": [
                      {
                        "type": "TSTypeReference",
                        "typeName": {
                          "type": "Identifier",
                          "name": conf.responseType
                        }
                      },
                      {
                        "type": "TSTypeReference",
                        "typeName": {
                          "type": "Identifier",
                          "name": "Error"
                        }
                      },
                      {
                        "type": "TSTypeReference",
                        "typeName": {
                          "type": "Identifier",
                          "name": "TData"
                        }
                      }
                    ]
                  }
                }
              }
            ],
            "directives": []
          },
          "typeParameters": {
            "type": "TSTypeParameterDeclaration",
            "params": [
              {
                "type": "TSTypeParameter",
                "name": "TData",
                "default": {
                  "type": "TSTypeReference",
                  "typeName": {
                    "type": "Identifier",
                    "name": conf.responseType

                  }
                }
              }
            ],
            "extra": {
              "trailingComma": 169
            }
          }
        }
      }
    ],
    "kind": "const"
  }
};

export default (fileStrContent: string) => {
  const ast: any = {
    "type": "File",
    "errors": [],
    "program": {
      "type": "Program",
      "sourceType": "module",
      "interpreter": null,
      "body": [],
      "directives": []
    },
    "comments": []
  }

  const jsonContent = JSON.parse(fileStrContent)

  Object.entries(jsonContent).forEach(([key, value]) => {
    const config = new ModuleConfig(key,value as Record<string, string>)

    ast.program.body.push(generateInterfaceAST(config))
    ast.program.body.push(generateHookAST(config))

  });

  return ast

};
