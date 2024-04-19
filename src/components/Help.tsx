import { List, ListItem, Paper, Typography } from "@mui/material";
import styles from '../css/Help.module.css'
import { CloseBtn } from "./buttons/CloseBtn";

type Props = {
  close: () => void
};

export function Help({ close }: Props) {

  const capabilities = [
    "Unlimited number of participants in the deal",
    "There are no restrictions on the amount each participant can add",
    "The outcome of the deal is either one winner or a draw",
    "After the deal is completed, the contract is disabled",
    "The arbiter is not permitted to participate in the deal",
    "The arbiter will receive a commission only if the deal is successful",
    "The contract only charges a fee upon withdrawal of funds",
    "Once confirmed by all participants, the deal is considered approved and awaits the arbiter's decision",
    "Until the deal is approved by all participants, anyone can join, add, or withdraw funds",
    "If one participant withdraws funds, confirmation of the new contract status is required from the other participants",
    "In the event of an approved contract, a participant may attempt to withdraw from the deal",
    "If all participants withdraw from an already approved deal, the deal is considered failed, and all parties can withdraw their funds"
  ];

  const typicalDeal = [
    "One of the participants initiates the deal, specifying the bet amount, arbiter's address, and the reward for the arbiter",
    "Once the deal is created, the creator's wallet receives confirmation from the deal contract address",
    "The received deal address is passed on to the second participant, who can find it here using the search",
    "The second participant opens the current deal and joins it, specifying the required amount",
    "If the second participant is satisfied with the amount deposited by the first participant and no further participants are expected, a confirmation flag for the deal can be set",
    "The first participant confirms the updated deal",
    "The deal, confirmed by all participants, awaits the decision of the arbiter, who can determine a winner or declare a draw",
  ];

  const settings = [
    "Contract fee: 0.5%",
    "Transaction gas: 0.1 TON",
    "Minimal bet sum: 0.01 TON"
  ];

  return (
    <Paper
      className={styles.paper}
      elevation={3}>
      <div className={styles.close}>
        <CloseBtn onClick={close}></CloseBtn>
      </div>
      <Typography variant="h6" sx={{
        display: "flex",
        justifyContent: "center",
        color: "darkred",
        mt: { xs: '24px', md: '0px' }
      }}>
        Attention! This is a testnet version
      </Typography>

      <div>
        <Typography variant="h6" gutterBottom>
          Purpose
        </Typography>
        <Typography variant="body1" gutterBottom>
          Concluding deals between two or more parties with the involvement of a deal guarantor.
        </Typography>
      </div>

      <div>
        <Typography variant="h6" gutterBottom>
          Capabilities and limitations
        </Typography>
        <List>
          {capabilities.map((row, key) => (
            <ListItem key={key} disablePadding>
              <Typography variant="body1"> {'‣ ' + row} </Typography>
            </ListItem>
          ))}
        </List>
      </div>

      <div>
        <Typography variant="h6" gutterBottom>
          Typical process of creating a deal between two participants
        </Typography>
        <List>
          {typicalDeal.map((row, key) => (
            <ListItem key={key} disablePadding>
              <Typography variant="body1"> {`${key + 1}. ${row}.`} </Typography>
            </ListItem>
          ))}
        </List>
      </div>

      <div>
        <Typography variant="h6" gutterBottom>
          Current contract settings (for testing)
        </Typography>
        <List>
          {settings.map((row, key) => (
            <ListItem key={key} disablePadding>
              <Typography variant="body1"> {`${key + 1}. ${row}.`} </Typography>
            </ListItem>
          ))}
        </List>
      </div>
    </Paper>

  );
}
