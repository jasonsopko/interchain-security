# Testing

To increase confidence in the correctness of the Interchain Security code we consider various testing approaches.

## Unit Tests

Unit tests are useful for simple standalone functionality, and CRUD operations. Unit tests should use golang's standard testing package, and be defined in files formatted as ```<file being tested>_test.go``` in the same directory as the file being tested, following standard conventions.

[Mocked external keepers](testutil/keeper/mocks.go) (implemented with [gomock](https://github.com/golang/mock)) are available for testing code that briefly interacts with external modules, but still only a single function/method relevant to ccv, and a single chain. Ie. do not use mocked external keepers to test the integration of the ccv module with external modules, or integration between consumer and provider.

## Integration Tests

[integration-tests](tests/integration/) utilize the [IBC Testing Package](https://github.com/cosmos/ibc-go/tree/main/testing), and test functionality that is wider in scope than a unit test, but still able to be validated in-memory. Ie. code where advancing blocks would be useful, simulated handshakes, simulated packet relays, etc.

To run integration tests against your own consumer/provider implementations, use [instance_test.go](tests/integration/instance_test.go) as an example. All you'll need to do is make sure your applications implement the necessary interfaces defined in [interfaces.go](testutil/integration/interfaces.go), pattern match [specific_setup.go](testutil/ibc_testing/specific_setup.go), then pass in the appropriate types and parameters to the suite, as is done in `instance_test.go` for the dummy provider/consumer implementations.

A list of test scenarios covered by integration tests can be found in [scripts/test_doc/test_documentation.md](scripts/test_doc/test_documentation.md).
When adding an integration test, write a brief description as a docstring in the Golang code in this schema:

```go
// This is a test that tests foo and bar.
// @Long Description@
// Here is a detailed description
// that goes into more detail and describes the scenario.
```

Then, run `make build-testing-docs` to update the test documentation.

## Model-Based Tests (MBT)

[MBT](tests/mbt/) tests are similar to integration tests, but they compare the system state to an expected state generated from a formally verified specification written in Quint.

## End-to-End (E2E) Tests

[E2E tests](tests/e2e/) run true consumer and provider chain binaries within a docker container and are relevant to the highest level of functionality. E2E tests use queries/transactions invoked from CLI to drive and validate the code.

## Simulation Tests

[Simulation tests](app/provider/sim_test.go) are used to test the full application via the SDK's simulation framework. This framework generates random inputs and checks that certain user-defined invariants hold.
Notably, as-of-now simulation tests do not include any multi-chain testing, so can only test the provider chain on its own, without consumer chains. 

## Compatibility Tests

To test compatibility between different provider and consumer versions the [E2E tests](tests/e2e/) were extended by compatibility tests. The test cases perform basic sanity tests against the selected provider and consumer versions. A selected combination of provider and consumer versions are tested on a nightly bases and can be run locally with the
related make command listed below.

## Interchain Tests
The interchain tests evaluate the fundamental functionalities of both the provider and provider-consumer chains. This includes testing the transition of a sovereign chain to a consumer chain. These tests leverage the interchain framework, where each chain node operates within its own Docker container.To execute these tests, you can use the default ics image built from the latest code on the main branch. Alternatively, tests can be run with a specific image and version, whether published or locally built. The tests are triggered using the make test-interchain command. For more details, see the [Running Tests](#running-tests) section.
- If you wish to build the docker image from the code on your desired branch, run this command:
```bash
    docker build -t test-image:local .
```

## Running Tests
Tests can be run using `make`:

```bash
# run unit, integration, diff, and E2E tests
make test

# run unit tests
make test-unit

# run integration tests
make test-integration

# run mbt tests
make test-mbt

# run unit, integration, and mbt tests - shortcut for local development
make test-dev

# run E2E tests
make test-e2e

# run only happy path E2E tests
make test-e2e-short

# equivalent to make test with caching disabled
make test-no-cache

# run E2E compatibility tests for selected provider and consumer versions
make test-e2e-compatibility-tests-latest

# run full simulation tests
make sim-full

#run simulation tests where providerModule.max_provider_consensus_validators=stakingModule.max_validators=100
make sim-full-no-inactive-vals

#run interchain tests (running with the latest image ghcr.io/cosmos/interchain-security:latest)
make test-interchain
# run interchain tests with specific image(e.g. test-image:local)
make test-interchain PROVIDER_IMAGE_NAME=test-image PROVIDER_IMAGE_TAG=local SOVEREIGN_IMAGE_NAME=test-image SOVEREIGN_IMAGE_TAG=local
# to run single interchain test, first navigate to /tests/interchain directory and run the command for desired test e.g.
# go test -run ^TestMultiValidatorProviderSuite/TestOptInChainCanOnlyStartIfActiveValidatorOptedIn$ ./...
```

Alternatively you can run tests using `go test`:
```bash
# run all unit, integration, and diff tests using go
go test ./...
# run all unit, integration, and diff tests with verbose output
go test -v ./..
# run all unit, integration, and diff tests with coverage stats
go test -coverpkg=./x/... -coverprofile=coverage.out ./...
# run a single unit test
go test -run <unit-test-name> path/to/package
# example: run a single unit test
go test -run TestSlashAcks ./x/ccv/provider/keeper
# run a single integration test
go test -run <test-suite-name>/<test-name> ./...
# example: run a single integration test
go test -run TestProviderTestSuite/TestPacketRoundtrip ./...
# run all E2E tests
go run ./tests/e2e/...
# run all E2E tests with a local cosmos sdk
go run ./tests/e2e/... --local-sdk-path "/Users/bob/Documents/cosmos-sdk/"
# run golang native fuzz tests (https://go.dev/doc/tutorial/fuzz)
go test -fuzz=<regex-to-match-test-name>
# run verbose E2E tests
go run ./tests/e2e/... --local-sdk-path "/Users/bob/Documents/cosmos-sdk/" --verbose
# run simulation tests; should be run from the 0app/provider directory
go test -mod=readonly . -run=^TestFullAppSimulation$  -Enabled=true -NumBlocks=500 -BlockSize=200 -Commit=true -timeout 24h -v
```

### Testing with Gaia as the provider

Integration tests can be run with Gaia as the provider.
By default, the latest tagged release of Gaia is used - this includes release candidates and stabile releases.

```bash
# use gaia as the provider
go run ./tests/integration/... --use-gaia

# use gaia as the provider - use specific tagged release
go run ./tests/integration/... --use-gaia --gaia-tag v9.0.0
```

NOTE: versions < v9.0.0 are not compatible with ICS.

## Linters and Static Analysis

Several analyzers are used on the code including [CodeQL](https://codeql.github.com/), [SonarCloud](https://sonarcloud.io/), [golangci-lint](https://golangci-lint.run/) and [gosec](https://github.com/securego/gosec). Some of these are run on github when committing to PRs etc, but some tools are also applicable locally, and are built into golang.

```bash
# gofmt to format and simplify code (https://pkg.go.dev/cmd/gofmt)
gofmt -w -s -e .
# go vet to search for suspicious code (https://pkg.go.dev/cmd/vet)
go vet ./...
```

Some useful tools are included in the repository using [pre-commit](https://pre-commit.com/hooks.html). pre-commit lets you run developer tools either on every git commit, or manually with `pre-commit run --all-files`. See the [config](.pre-commit-config.yaml) for details. In this repo the hooks are not installed to git, as that can be cumbersome, but it is still possible to benefit from them.

```bash
## Prerequisites

# pre-commit
brew install pre-commit
# goimports (https://pkg.go.dev/golang.org/x/tools/cmd/goimports)
go install golang.org/x/tools/cmd/goimports@latest
# gocyclo (https://github.com/fzipp/gocyclo)
go install github.com/fzipp/gocyclo/cmd/gocyclo@latest
# go-critic https://github.com/go-critic/go-critic
go install github.com/go-critic/go-critic/cmd/gocritic@latest

## Run the tools

pre-commit run --all-files
```

## Debugging

If using VSCode, see [vscode-go/wiki/debugging](https://github.com/golang/vscode-go/wiki/debugging) to debug unit tests or go binaries.

## More

More instructions will be added soon, in time for the testnet.
