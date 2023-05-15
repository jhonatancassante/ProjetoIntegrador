import React, { Component } from 'react';
import { TextField, Button, Box, Autocomplete, Tooltip } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const urlRegExp = /(https?:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-z]+(\/[^\s]*)?/i;

export class Apresentacao extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listaCategorias: [],
			selectBoxStyle: {
				width: { xs: '100%', md: '45%' },
				marginBottom: '2.625rem',
			},
		};
		this.CosplayDesfile = 'Cosplay Desfile';
		this.CosplayCircuito = 'Cosplay Circuito';
		this.fetchCategorias = this.fetchCategorias.bind(this);
		this.categoriaSelecionada = this.categoriaSelecionada.bind(this);
		this.fetchCategorias();
	}

	continue = (e) => {
		this.props.nextStep();
	};

	back = (e) => {
		e.preventDefault();
		this.props.prevStep();
	};

	async fetchCategorias() {
		try {
			const response = await api.get('/lista/categoria');
			const categorias = response.data.map((categoria) => ({
				extra_categ: categoria.categ_id,
				extra_categ_nome: categoria.categ_nome,
			}));
			categorias.push({ extra_categ: 0, extra_categ_nome: '' });
			this.setState({ listaCategorias: categorias });
		} catch (error) {
			console.error(error);
		}
	}

	categoriaSelecionada = async (event, value) => {
		try {
			const { handleChangeAutocomplete } = this.props;
			await handleChangeAutocomplete(value);
		} catch (error) {
			console.log(error);
		}
	};

	switchExtra = (concurso, props) => {
		const { listaCategorias, selectBoxStyle } = this.state;
		const { extra_categ, extra_categ_nome } = this.props.values;

		switch (concurso) {
			case this.CosplayDesfile:
				return (
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-around',
							flexDirection: { xs: 'column', md: 'row' },
						}}
					>
						<Tooltip title="Selecione a categoria a qual irá competir.">
							<Autocomplete
								id="cad-select-estado"
								getOptionLabel={(listaCategorias) =>
									`${listaCategorias.extra_categ_nome}`
								}
								options={listaCategorias}
								sx={selectBoxStyle}
								isOptionEqualToValue={(option, value) =>
									option.extra_categ_nome === value.extra_categ_nome
								}
								noOptionsText={'Nenhuma categoria está disponível.'}
								renderOption={(props, listaCategorias) => (
									<Box
										component="li"
										{...props}
										key={listaCategorias.extra_categ}
									>
										{listaCategorias.extra_categ_nome}
									</Box>
								)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Categoria"
										error={
											props.touched.extra_categ_nome &&
											Boolean(props.errors.extra_categ_nome)
										}
										helperText={
											props.touched.extra_categ_nome &&
											props.errors.extra_categ_nome
										}
										required
										variant="outlined"
									/>
								)}
								onChange={(event, values, select, option) => {
									this.categoriaSelecionada(event, values, select, option);
									props.handleChange(event, values, select, option);
								}}
								onBlur={props.handleBlur}
								value={{
									extra_categ: extra_categ,
									extra_categ_nome: extra_categ_nome,
								}}
								disableClearable
							/>
						</Tooltip>
					</Box>
				);
			case this.CosplayCircuito:
				return <h1>Ainda sem Extra... Aguarde...</h1>;
			default:
				return;
		}
	};

	render() {
		const { apres_nome, apres_origem, apres_link_ref, part_conc_nome } =
			this.props.values;

		return (
			<React.Fragment>
				<Formik
					initialValues={{
						apres_nome,
						apres_origem,
						apres_link_ref,
						part_conc_nome,
					}}
					validationSchema={Yup.object().shape({
						apres_nome: Yup.string()
							.required('Campo requerido.')
							.min(3, 'Deve conter no mínimo 3 caracteres.'),
						apres_origem: Yup.string()
							.required('Campo requerido.')
							.min(3, 'Deve conter no mínimo 3 caracteres.'),
						apres_link_ref: Yup.string()
							.matches(urlRegExp, 'Deve ser um link válido.')
							.required('Campo requerido.'),
					})}
					onSubmit={(values) => {
						this.continue();
					}}
				>
					{(props) => {
						const {
							values,
							handleChange,
							touched,
							errors,
							isValid,
							handleBlur,
						} = props;

						return (
							<Form style={{ width: '100%' }}>
								<Box
									sx={{
										width: '100%',
										marginTop: '1.875rem',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Box
										sx={{
											width: '100%',
											display: 'flex',
											justifyContent: 'space-around',
											flexDirection: { xs: 'column', md: 'row' },
										}}
									>
										<Box
											sx={{
												width: { xs: '100%', md: '45%' },
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											<Tooltip title="Digite o nome do personagem ou música que irá apresentar.">
												<TextField
													sx={{ marginBottom: '2.625rem', width: '100%' }}
													id="apres_nome"
													label="Nome do Personagem / Música"
													placeholder="Goku"
													variant="outlined"
													value={values.apres_nome}
													onChange={handleChange}
													onChangeCapture={this.props.handleChange(
														'apres_nome'
													)}
													onBlur={handleBlur}
													error={errors.apres_nome && touched.apres_nome}
													helperText={touched.apres_nome && errors.apres_nome}
													required
												/>
											</Tooltip>
										</Box>
										<Box
											sx={{
												width: { xs: '100%', md: '45%' },
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											<Tooltip title="Digite a origem do seu personage (Dragon Ball Z, Cavaleiros dos Zodiácos, etc) ou música (Blackpink, BTS, etc).">
												<TextField
													sx={{ marginBottom: '2.625rem', width: '100%' }}
													id="apres_origem"
													label="Origem do Personagem / Música"
													placeholder="Dragon Ball Z"
													variant="outlined"
													value={values.apres_origem}
													onChange={handleChange}
													onChangeCapture={this.props.handleChange(
														'apres_origem'
													)}
													onBlur={handleBlur}
													error={errors.apres_origem && touched.apres_origem}
													helperText={
														touched.apres_origem && errors.apres_origem
													}
													required
												/>
											</Tooltip>
										</Box>
									</Box>

									<Box
										sx={{
											width: '100%',
											display: 'flex',
											justifyContent: 'space-around',
										}}
									>
										<Box
											sx={{
												width: { xs: '100%', md: '95%' },
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											<Tooltip title="Entre com o link contendo imagem / vídeo / música de referência do personagem ou música a ser apresentada.">
												<TextField
													sx={{ marginBottom: '2.625rem', width: '100%' }}
													id="apres_link_ref"
													label="Link de Referência"
													placeholder="https://drive.google.com/file/d/12Pq84KiIRZphXmrdeG-slTM5LpyAin13/view?usp=sharing"
													variant="outlined"
													value={values.apres_link_ref}
													onChange={handleChange}
													onChangeCapture={this.props.handleChange(
														'apres_link_ref'
													)}
													onBlur={handleBlur}
													error={
														errors.apres_link_ref && touched.apres_link_ref
													}
													helperText={
														touched.apres_link_ref && errors.apres_link_ref
													}
													required
												/>
											</Tooltip>
										</Box>
									</Box>

									{this.switchExtra(part_conc_nome, props)}

									<Box
										sx={{
											width: '100%',
											display: 'flex',
											justifyContent: 'space-around',
										}}
									>
										<Button
											sx={{ margin: '.625rem', width: '7.5rem' }}
											variant="contained"
											onClick={this.back}
										>
											Voltar
										</Button>
										<Button
											sx={{ margin: '.625rem', width: '7.5rem' }}
											type="submit"
											variant="contained"
											disabled={!isValid}
										>
											Continuar
										</Button>
									</Box>
								</Box>
							</Form>
						);
					}}
				</Formik>
			</React.Fragment>
		);
	}
}

export default Apresentacao;
