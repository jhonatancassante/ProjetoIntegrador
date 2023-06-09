import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CadastroForm from '../components/CadastroStepper';
import { deepOrange } from '@mui/material/colors';
import { StyledTab, StyledTabs } from '../styles/StyledTabs';

class CadastroPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			activeStep: 0,
			steps: [
				'Evento & Concurso',
				'Regras',
				'Informação Pessoal',
				'Apresentação',
				'Resumo',
			],
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event, newValue) {
		this.setState({ value: newValue });
	}

	TabPanel(props) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`vertical-tabpanel-${index}`}
				aria-labelledby={`vertical-tab-${index}`}
				{...other}
				style={{ width: '100%', padding: '1.875rem' }}
			>
				{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
			</div>
		);
	}

	render() {
		const { value } = this.state;

		this.TabPanel.propTypes = {
			children: PropTypes.node,
			index: PropTypes.number.isRequired,
			value: PropTypes.number.isRequired,
		};

		const TabPanel = this.TabPanel;

		function a11yProps(index) {
			return {
				id: `vertical-tab-${index}`,
				'aria-controls': `vertical-tabpanel-${index}`,
			};
		}

		return (
			<Box
				sx={{
					width: '100%',
					flexGrow: 1,
					display: 'flex',
				}}
			>
				<StyledTabs
					orientation="vertical"
					variant="scrollable"
					value={value}
					textColor="primary"
					indicatorColor="primary"
					onChange={this.handleChange}
					aria-label="Vertical tabs example"
					sx={{
						borderRight: 1,
						borderColor: 'divider',
						width: '18.75rem',
						bgcolor: deepOrange[500],
						minHeight: 'calc(100dvh - 4.25rem)',
					}}
				>
					<StyledTab label="Cadastro" {...a11yProps(0)} />
					<StyledTab label="Alteração de E-Mail" {...a11yProps(1)} />
				</StyledTabs>
				<TabPanel value={value} index={0}>
					<CadastroForm />
				</TabPanel>
				<TabPanel value={value} index={1}>
					Em construção!
				</TabPanel>
			</Box>
		);
	}
}

export default CadastroPage;
