'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">YARLOMIA Documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' : 'data-target="#xs-components-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' :
                                            'id="xs-components-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CountdownSnackbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CountdownSnackbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WelcomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WelcomeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' : 'data-target="#xs-injectables-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' :
                                        'id="xs-injectables-links-module-AppModule-413285a36069693e5241cb719ecdd63f"' }>
                                        <li class="link">
                                            <a href="injectables/CountdownService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CountdownService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StateParameterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateParameterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FileUploadModule.html" data-type="entity-link">FileUploadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FileUploadModule-ea6376c66bdd97824a56b9a46296bdb2"' : 'data-target="#xs-components-links-module-FileUploadModule-ea6376c66bdd97824a56b9a46296bdb2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FileUploadModule-ea6376c66bdd97824a56b9a46296bdb2"' :
                                            'id="xs-components-links-module-FileUploadModule-ea6376c66bdd97824a56b9a46296bdb2"' }>
                                            <li class="link">
                                                <a href="components/FileUploadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FileUploadComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RFormModule.html" data-type="entity-link">RFormModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RFormModule-b683dcab3b818b119e83c0f6956549f3"' : 'data-target="#xs-components-links-module-RFormModule-b683dcab3b818b119e83c0f6956549f3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RFormModule-b683dcab3b818b119e83c0f6956549f3"' :
                                            'id="xs-components-links-module-RFormModule-b683dcab3b818b119e83c0f6956549f3"' }>
                                            <li class="link">
                                                <a href="components/DynamicFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DynamicFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DynamicFormQuestionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DynamicFormQuestionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RFormComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-579284df283b474c90f06b9346c40d37"' : 'data-target="#xs-components-links-module-UserModule-579284df283b474c90f06b9346c40d37"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-579284df283b474c90f06b9346c40d37"' :
                                            'id="xs-components-links-module-UserModule-579284df283b474c90f06b9346c40d37"' }>
                                            <li class="link">
                                                <a href="components/UserDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AreaQuestion.html" data-type="entity-link">AreaQuestion</a>
                            </li>
                            <li class="link">
                                <a href="classes/DropdownQuestion.html" data-type="entity-link">DropdownQuestion</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionBase.html" data-type="entity-link">QuestionBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/TextboxQuestion.html" data-type="entity-link">TextboxQuestion</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/EventService.html" data-type="entity-link">EventService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileUploadService.html" data-type="entity-link">FileUploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionControlService.html" data-type="entity-link">QuestionControlService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionService.html" data-type="entity-link">QuestionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/FormGuard.html" data-type="entity-link">FormGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/UserDetailGuard.html" data-type="entity-link">UserDetailGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link">IUser</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});