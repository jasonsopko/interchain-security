package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	ibctmtypes "github.com/cosmos/ibc-go/v8/modules/light-clients/07-tendermint"
	"github.com/spf13/cobra"

	"cosmossdk.io/math"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/version"

	tmproto "github.com/cometbft/cometbft/proto/tendermint/types"

	"github.com/cosmos/interchain-security/v6/x/ccv/provider/types"
)

// GetTxCmd returns the transaction commands for this module
func GetTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("%s transactions subcommands", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	cmd.AddCommand(NewAssignConsumerKeyCmd())
	cmd.AddCommand(NewSubmitConsumerMisbehaviourCmd())
	cmd.AddCommand(NewSubmitConsumerDoubleVotingCmd())
	cmd.AddCommand(NewCreateConsumerCmd())
	cmd.AddCommand(NewUpdateConsumerCmd())
	cmd.AddCommand(NewRemoveConsumerCmd())
	cmd.AddCommand(NewOptInCmd())
	cmd.AddCommand(NewOptOutCmd())
	cmd.AddCommand(NewSetConsumerCommissionRateCmd())

	return cmd
}

func NewAssignConsumerKeyCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "assign-consensus-key [consumer-id] [consumer-pubkey]",
		Short: "assign a consensus public key to use for a consumer chain",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			submitter := clientCtx.GetFromAddress().String()
			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			providerValAddr := clientCtx.GetFromAddress()

			msg, err := types.NewMsgAssignConsumerKey(args[0], sdk.ValAddress(providerValAddr), args[1], submitter)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewSubmitConsumerMisbehaviourCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-consumer-misbehaviour [consumer-id] [misbehaviour]",
		Short: "submit an IBC misbehaviour for a consumer chain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit an IBC misbehaviour detected on a consumer chain.
An IBC misbehaviour contains two conflicting IBC client headers, which are used to form a light client attack evidence.
The misbehaviour type definition can be found in the IBC client messages, see ibc-go/proto/ibc/core/client/v1/tx.proto.

Example:
%s tx provider submit-consumer-misbehaviour [consumer-id] [path/to/misbehaviour.json]
			`, version.AppName)),
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			submitter := clientCtx.GetFromAddress()
			misbJson, err := os.ReadFile(args[1])
			if err != nil {
				return err
			}

			cdc := codec.NewProtoCodec(clientCtx.InterfaceRegistry)

			misbehaviour := ibctmtypes.Misbehaviour{}
			if err := cdc.UnmarshalJSON(misbJson, &misbehaviour); err != nil {
				return fmt.Errorf("misbehaviour unmarshalling failed: %s", err)
			}

			msg, err := types.NewMsgSubmitConsumerMisbehaviour(args[0], submitter, &misbehaviour)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewSubmitConsumerDoubleVotingCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-consumer-double-voting [consumer-id] [evidence] [infraction_header]",
		Short: "submit a double voting evidence for a consumer chain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit a Tendermint duplicate vote evidence detected on a consumer chain with
 the IBC light client header for the infraction height.
 The DuplicateVoteEvidence type definition can be found in the Tendermint messages,
 see cometbft/proto/tendermint/types/evidence.proto and the IBC header
 definition can be found in the IBC messages, see ibc-go/proto/ibc/lightclients/tendermint/v1/tendermint.proto.

Example:
%s tx provider submit-consumer-double-voting [consumer-id] [path/to/evidence.json] [path/to/infraction_header.json]
`, version.AppName)),
		Args: cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			submitter := clientCtx.GetFromAddress()
			cdc := codec.NewProtoCodec(clientCtx.InterfaceRegistry)

			evidenceJson, err := os.ReadFile(args[1])
			if err != nil {
				return err
			}

			ev := tmproto.DuplicateVoteEvidence{}
			if err := cdc.UnmarshalJSON(evidenceJson, &ev); err != nil {
				return fmt.Errorf("duplicate vote evidence unmarshalling failed: %s", err)
			}

			headerJson, err := os.ReadFile(args[2])
			if err != nil {
				return err
			}

			header := ibctmtypes.Header{}
			if err := cdc.UnmarshalJSON(headerJson, &header); err != nil {
				return fmt.Errorf("infraction IBC header unmarshalling failed: %s", err)
			}

			msg, err := types.NewMsgSubmitConsumerDoubleVoting(args[0], submitter, &ev, &header)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewCreateConsumerCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-consumer [consumer-parameters]",
		Short: "create a consumer chain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Create a consumer chain and get the assigned consumer id of this chain.
Note that the one that signs this message is the owner of this consumer chain. The owner can be later
changed by updating the consumer chain.

Example:
%s tx provider create-consumer [path/to/create_consumer.json]

where create_consumer.json has the following structure:
{
  "chain_id": "consumer-1",
  "metadata": {
    "name": "chain consumer",
    "description": "description",
    "metadata": "{\"forge_json_url\": \"...\", \"stage\": \"mainnet\"}"
  },
  "initialization_parameters": {
    "initial_height": {
     "revision_number": 1,
     "revision_height": 1
    },
    "genesis_hash": "",
    "binary_hash": "",
    "spawn_time": "2024-08-29T12:26:16.529913Z",
    "unbonding_period": 1728000000000000,
    "ccv_timeout_period": 2419200000000000,
    "transfer_timeout_period": 1800000000000,
    "consumer_redistribution_fraction": "0.75",
    "blocks_per_distribution_transmission": 1000,
    "historical_entries": 10000,
    "distribution_transmission_channel": "",
    "connection_id": ""
  },
  "power_shaping_parameters": {
    "top_N": 0,
    "validators_power_cap": 10,
    "validator_set_cap": 0,
    "allowlist": ["cosmosvalcons..."],
    "denylist": ["cosmosvalcons..."],
    "min_stake": 0,
    "allow_inactive_vals": false,
    "prioritylist": ["cosmosvalcons..."]
  },
  "infraction_parameters":{
   "double_sign":{
      "slash_fraction": "0.05",
      "jail_duration": 9223372036854775807,
      "tombstone": true	 
   },
   "downtime":{
      "slash_fraction": "0.0001",
      "jail_duration": 600000000000,
      "tombstone": false	 
   }
  },
  "allowlisted_reward_denoms": {
    "denoms": ["ibc/...", "ibc/..."]
  }
}

Note that both 'chain_id' and 'metadata' are mandatory;
and 'initialization_parameters', 'power_shaping_parameters' and 'allowlisted_reward_denoms' are optional. 
The parameters not provided are set to their zero value. 
`, version.AppName)),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			submitter := clientCtx.GetFromAddress().String()

			consCreateJson, err := os.ReadFile(args[0])
			if err != nil {
				return err
			}
			consCreate := types.MsgCreateConsumer{}
			if err = json.Unmarshal(consCreateJson, &consCreate); err != nil {
				return fmt.Errorf("consumer data unmarshalling failed: %w", err)
			}

			msg, err := types.NewMsgCreateConsumer(submitter, consCreate.ChainId, consCreate.Metadata, consCreate.InitializationParameters,
				consCreate.PowerShapingParameters, consCreate.AllowlistedRewardDenoms, consCreate.InfractionParameters)
			if err != nil {
				return err
			}
			if err = msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewUpdateConsumerCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "update-consumer [consumer-parameters]",
		Short: "update a consumer chain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Update a consumer chain to change its parameters (e.g., spawn time, allow list, etc.).
Note that only the owner of the chain can initialize it.

Example:
%s tx provider update-consumer [path/to/update_consumer.json]

where update_consumer.json has the following structure:
{
   "consumer_id": "0",
   "new_owner_address": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
   "metadata": {
    "name": "chain consumer",
    "description": "description",
    "metadata": "{\"forge_json_url\": \"...\", \"stage\": \"mainnet\"}"
   },
   "initialization_parameters": {
    "initial_height": {
     "revision_number": 1,
     "revision_height": 1
    },
    "genesis_hash": "",
    "binary_hash": "",
    "spawn_time": "2024-08-29T12:26:16.529913Z",
    "unbonding_period": 1728000000000000,
    "ccv_timeout_period": 2419200000000000,
    "transfer_timeout_period": 1800000000000,
    "consumer_redistribution_fraction": "0.75",
    "blocks_per_distribution_transmission": 1000,
    "historical_entries": 10000,
    "distribution_transmission_channel": "",
	"connection_id": ""
   },
   "power_shaping_parameters": {
    "top_N": 0,
    "validators_power_cap": 10,
    "validator_set_cap": 0,
    "allowlist": ["cosmosvalcons..."],
    "denylist": ["cosmosvalcons..."],
    "min_stake": 0,
    "allow_inactive_vals": false,
    "prioritylist": ["cosmosvalcons..."]
   },
  "infraction_parameters":{
   "double_sign":{
      "slash_fraction": "0.05",
      "jail_duration": 9223372036854775807,
      "tombstone": true	  
   },
   "downtime":{
      "slash_fraction": "0.0001",
      "jail_duration": 600000000000,
      "tombstone": false	 
   }
  },
  "allowlisted_reward_denoms": {
    "denoms": ["ibc/...", "ibc/..."]
  }
  "new_chain_id": "newConsumer-1", // is optional and can be empty (i.e., "new_chain_id": "")
}

Note that only 'consumer_id' is mandatory. The others are optional.
Not providing one of them will leave the existing values unchanged. 
Providing one of 'metadata', 'initialization_parameters', 'power_shaping_parameters', or 'allowlisted_reward_denoms' 
will update all the containing fields. 
If one of the fields is missing, it will be set to its zero value.
`, version.AppName)),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			owner := clientCtx.GetFromAddress().String()

			consUpdateJson, err := os.ReadFile(args[0])
			if err != nil {
				return err
			}

			consUpdate := types.MsgUpdateConsumer{}
			if err = json.Unmarshal(consUpdateJson, &consUpdate); err != nil {
				return fmt.Errorf("consumer data unmarshalling failed: %w", err)
			}

			if strings.TrimSpace(consUpdate.ConsumerId) == "" {
				return fmt.Errorf("consumer_id can't be empty")
			}

			msg, err := types.NewMsgUpdateConsumer(owner, consUpdate.ConsumerId, consUpdate.NewOwnerAddress, consUpdate.Metadata,
				consUpdate.InitializationParameters, consUpdate.PowerShapingParameters, consUpdate.AllowlistedRewardDenoms, consUpdate.NewChainId, consUpdate.InfractionParameters)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewRemoveConsumerCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "remove-consumer [consumer-id]",
		Short: "remove a consumer chain",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Removes (and stops) a consumer chain. Note that only the owner of the chain can remove it.
Example:
%s tx provider remove-consumer [consumer-id]
`, version.AppName)),
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			owner := clientCtx.GetFromAddress().String()
			consumerId := args[0]

			msg, err := types.NewMsgRemoveConsumer(owner, consumerId)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewOptInCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use: "opt-in [consumer-id] [consumer-pubkey]",
		Short: "opts in validator to the consumer chain, and if given uses the " +
			"provided consensus public key for this consumer chain",
		Args: cobra.RangeArgs(1, 2),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			providerValAddr := clientCtx.GetFromAddress()

			var consumerPubKey string
			if len(args) == 2 {
				// consumer public key was provided
				consumerPubKey = args[1]
			} else {
				consumerPubKey = ""
			}

			submitter := clientCtx.GetFromAddress().String()
			msg, err := types.NewMsgOptIn(args[0], sdk.ValAddress(providerValAddr), consumerPubKey, submitter)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewOptOutCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "opt-out [consumer-id]",
		Short: "opts out validator from this consumer chain",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			providerValAddr := clientCtx.GetFromAddress()

			submitter := clientCtx.GetFromAddress().String()
			msg, err := types.NewMsgOptOut(args[0], sdk.ValAddress(providerValAddr), submitter)
			if err != nil {
				return err
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}

func NewSetConsumerCommissionRateCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "set-consumer-commission-rate [consumer-id] [commission-rate]",
		Short: "set a per-consumer chain commission",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Note that the "commission-rate" argument is a fraction and should be in the range [0,1].
			Example:
			%s set-consumer-commission-rate 123 0.5`,
				version.AppName),
		),
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			txf, err := tx.NewFactoryCLI(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}
			txf = txf.WithTxConfig(clientCtx.TxConfig).WithAccountRetriever(clientCtx.AccountRetriever)

			providerValAddr := clientCtx.GetFromAddress()

			commission, err := math.LegacyNewDecFromStr(args[1])
			if err != nil {
				return err
			}
			submitter := clientCtx.GetFromAddress().String()
			msg := types.NewMsgSetConsumerCommissionRate(args[0], commission, sdk.ValAddress(providerValAddr), submitter)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}

			return tx.GenerateOrBroadcastTxWithFactory(clientCtx, txf, msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	_ = cmd.MarkFlagRequired(flags.FlagFrom)

	return cmd
}
